import crypto from "node:crypto";
import { Router } from "express";
import { PaymentProvider } from "@prisma/client";
import { env } from "../config/env";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { emitRealtime } from "../lib/realtime";

const router = Router();

router.post(
  "/razorpay/webhook",
  asyncHandler(async (req, res) => {
    const raw = getRawBody(req.body, req.rawBody);
    const signature = req.header("x-razorpay-signature");
    const verified = verifyHmac(raw, signature, env.RAZORPAY_WEBHOOK_SECRET);
    const payload = JSON.parse(raw.toString("utf8"));
    await prisma.paymentLog.create({
      data: {
        provider: "RAZORPAY",
        eventId: req.header("x-razorpay-event-id") ?? undefined,
        orderId: payload.payload?.payment?.entity?.order_id,
        paymentId: payload.payload?.payment?.entity?.id,
        status: payload.event ?? "unknown",
        amount: payload.payload?.payment?.entity?.amount ? payload.payload.payment.entity.amount / 100 : undefined,
        signatureVerified: verified,
        rawPayload: payload
      }
    });
    if (!verified) throw new ApiError(400, "Invalid Razorpay signature");

    if (["payment.captured", "order.paid"].includes(payload.event)) {
      const orderId = payload.payload?.payment?.entity?.order_id ?? payload.payload?.order?.entity?.id;
      const paymentId = payload.payload?.payment?.entity?.id;
      await creditDeposit("RAZORPAY", orderId, paymentId);
    }

    res.json({ data: { ok: true } });
  })
);

router.post(
  "/cashfree/webhook",
  asyncHandler(async (req, res) => {
    const raw = getRawBody(req.body, req.rawBody);
    const signature = req.header("x-webhook-signature");
    const timestamp = req.header("x-webhook-timestamp") ?? "";
    const verified = verifyCashfreeSignature(timestamp, raw, signature);
    const payload = JSON.parse(raw.toString("utf8"));
    const orderId = payload.data?.order?.order_id ?? payload.order_id;
    const paymentId = payload.data?.payment?.cf_payment_id ?? payload.cf_payment_id;
    await prisma.paymentLog.create({
      data: {
        provider: "CASHFREE",
        eventId: payload.event_time ? `${orderId}-${payload.event_time}` : undefined,
        orderId,
        paymentId: paymentId ? String(paymentId) : undefined,
        status: payload.type ?? payload.payment_status ?? "unknown",
        amount: payload.data?.order?.order_amount ?? payload.order_amount,
        signatureVerified: verified,
        rawPayload: payload
      }
    });
    if (!verified) throw new ApiError(400, "Invalid Cashfree signature");

    const status = payload.data?.payment?.payment_status ?? payload.payment_status;
    if (status === "SUCCESS" || payload.type === "PAYMENT_SUCCESS_WEBHOOK") {
      await creditDeposit("CASHFREE", orderId, String(paymentId ?? ""));
    }
    res.json({ data: { ok: true } });
  })
);

function getRawBody(body: unknown, raw?: Buffer) {
  if (raw) return raw;
  if (Buffer.isBuffer(body)) return body;
  return Buffer.from(JSON.stringify(body ?? {}));
}

function verifyHmac(raw: Buffer, signature?: string, secret?: string) {
  if (!secret) return env.NODE_ENV !== "production";
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

function verifyCashfreeSignature(timestamp: string, raw: Buffer, signature?: string) {
  if (!env.CASHFREE_WEBHOOK_SECRET) return env.NODE_ENV !== "production";
  if (!signature) return false;
  const digest = crypto
    .createHmac("sha256", env.CASHFREE_WEBHOOK_SECRET)
    .update(timestamp + raw.toString("utf8"))
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

async function creditDeposit(provider: PaymentProvider, orderId?: string, paymentId?: string) {
  if (!orderId) return;
  await prisma.$transaction(async (tx) => {
    const txn = await tx.transaction.findFirst({
      where: { externalOrderId: orderId, provider, type: "DEPOSIT" }
    });
    if (!txn || txn.status === "SUCCESS") return;

    await tx.transaction.update({
      where: { id: txn.id },
      data: {
        status: "SUCCESS",
        externalPaymentId: paymentId
      }
    });
    await tx.wallet.update({
      where: { userId: txn.userId },
      data: { balance: { increment: txn.amount } }
    });
    await tx.notification.create({
      data: {
        userId: txn.userId,
        type: "WALLET",
        title: "Deposit successful",
        body: `Your deposit of INR ${txn.amount.toString()} has been added to your wallet.`,
        data: { transactionId: txn.id }
      }
    });
    emitRealtime("wallet:deposit", { userId: txn.userId, transactionId: txn.id });
  });
}

export default router;
