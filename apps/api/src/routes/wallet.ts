import { Router } from "express";
import Razorpay from "razorpay";
import { z } from "zod";
import { env } from "../config/env";
import { audit } from "../lib/audit";
import { randomToken } from "../lib/auth";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { emitRealtime } from "../lib/realtime";
import { paginationSchema } from "../lib/validation";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const wallet = await ensureWallet(req.user!.id);
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    res.json({ data: { wallet, transactions } });
  })
);

router.get(
  "/transactions",
  asyncHandler(async (req, res) => {
    const query = paginationSchema.parse(req.query);
    const where = { userId: req.user!.id };
    const [total, transactions] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      })
    ]);
    res.json({ data: transactions, page: query.page, pageSize: query.pageSize, total });
  })
);

router.post(
  "/deposit/create",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        amount: z.coerce.number().min(10).max(100000),
        provider: z.enum(["RAZORPAY", "CASHFREE"])
      })
      .parse(req.body);
    const wallet = await ensureWallet(req.user!.id);
    const reference = `DEP-${randomToken(8).toUpperCase()}`;

    if (input.provider === "RAZORPAY") {
      const order = await createRazorpayOrder(input.amount, reference);
      const txn = await prisma.transaction.create({
        data: {
          userId: req.user!.id,
          walletId: wallet.id,
          type: "DEPOSIT",
          status: "PENDING",
          provider: "RAZORPAY",
          amount: input.amount,
          reference,
          externalOrderId: order.id,
          metadata: JSON.parse(JSON.stringify(order))
        }
      });
      return res.status(201).json({
        data: {
          transaction: txn,
          order,
          keyId: env.RAZORPAY_KEY_ID
        }
      });
    }

    const order = await createCashfreeOrder({
      amount: input.amount,
      reference,
      userId: req.user!.id,
      email: req.user!.email,
      username: req.user!.username
    });
    const txn = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        walletId: wallet.id,
        type: "DEPOSIT",
        status: "PENDING",
        provider: "CASHFREE",
        amount: input.amount,
        reference,
        externalOrderId: (order as any).order_id,
        metadata: JSON.parse(JSON.stringify(order))
      }
    });
    return res.status(201).json({ data: { transaction: txn, order } });
  })
);

router.post(
  "/withdraw",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        amount: z.coerce.number().min(100).max(100000),
        payoutAccount: z.object({
          upi: z.string().optional(),
          bankAccount: z.string().optional(),
          ifsc: z.string().optional(),
          holderName: z.string().min(2)
        })
      })
      .parse(req.body);
    const wallet = await ensureWallet(req.user!.id);
    if (Number(wallet.winningBalance) < input.amount) {
      throw new ApiError(402, "Insufficient winning balance");
    }

    const withdrawal = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          winningBalance: { decrement: input.amount },
          lockedBalance: { increment: input.amount }
        }
      });
      const txn = await tx.transaction.create({
        data: {
          userId: req.user!.id,
          walletId: wallet.id,
          type: "WITHDRAWAL",
          status: "PENDING",
          amount: input.amount,
          reference: `WDR-${randomToken(8).toUpperCase()}`,

          metadata: {
  payoutAccount: maskPayout({
    holderName: input.payoutAccount.holderName || "",
    upi: input.payoutAccount.upi,
    bankAccount: input.payoutAccount.bankAccount,
    ifsc: input.payoutAccount.ifsc
  })
}
        }
      });
      return tx.withdrawalRequest.create({
        data: {
          userId: req.user!.id,
          transactionId: txn.id,
          amount: input.amount,
          payoutAccount: input.payoutAccount
        },
        include: { transaction: true }
      });
    });

    await audit(req, {
      action: "REQUEST_WITHDRAWAL",
      resource: "WithdrawalRequest",
      resourceId: withdrawal.id
    });
    emitRealtime("wallet:updated", { userId: req.user!.id });
    res.status(201).json({ data: withdrawal });
  })
);

async function ensureWallet(userId: string) {
  return prisma.wallet.upsert({
    where: { userId },
    create: { userId },
    update: {}
  });
}

async function createRazorpayOrder(amount: number, receipt: string) {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    if (env.NODE_ENV === "production") throw new ApiError(503, "Razorpay is not configured");
    return {
      id: `order_dev_${receipt}`,
      amount: amount * 100,
      currency: "INR",
      receipt,
      status: "created"
    };
  }

  const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
  });
  return razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt,
    notes: { brand: "FFX ESPORTS" }
  });
}

async function createCashfreeOrder(input: {
  amount: number;
  reference: string;
  userId: string;
  email: string;
  username: string;
}) {
  if (!env.CASHFREE_APP_ID || !env.CASHFREE_SECRET_KEY) {
    if (env.NODE_ENV === "production") throw new ApiError(503, "Cashfree is not configured");
    return {
      order_id: `cf_dev_${input.reference}`,
      payment_session_id: `session_${randomToken(8)}`,
      order_amount: input.amount,
      order_currency: "INR"
    };
  }

  const baseUrl =
    env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg/orders" : "https://sandbox.cashfree.com/pg/orders";
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-client-id": env.CASHFREE_APP_ID,
      "x-client-secret": env.CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01"
    },
    body: JSON.stringify({
      order_id: input.reference,
      order_amount: input.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.userId,
        customer_email: input.email,
        customer_name: input.username
      }
    })
  });
  if (!response.ok) throw new ApiError(502, "Cashfree order creation failed", await response.text());
  return response.json();
}

function maskPayout(input: { upi?: string; bankAccount?: string; ifsc?: string; holderName: string }) {
  return {
    holderName: input.holderName,
    upi: input.upi ? input.upi.replace(/^(.{2}).+(@.+)$/, "$1***$2") : undefined,
    bankAccount: input.bankAccount ? `****${input.bankAccount.slice(-4)}` : undefined,
    ifsc: input.ifsc
  };
}

export default router;
