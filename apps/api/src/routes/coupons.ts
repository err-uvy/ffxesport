import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";

const router = Router();

router.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const input = z.object({ code: z.string().min(2), amount: z.coerce.number().min(0) }).parse(req.body);
    const coupon = await prisma.coupon.findUnique({ where: { code: input.code.toUpperCase() } });
    if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
      throw new ApiError(404, "Coupon not available");
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new ApiError(409, "Coupon usage limit reached");
    const alreadyUsed = await prisma.couponRedemption.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId: req.user!.id } }
    });
    if (alreadyUsed) throw new ApiError(409, "Coupon already used");
    const discount =
      coupon.discountType === "FLAT"
        ? Math.min(Number(coupon.discountValue), input.amount)
        : Math.round((input.amount * Number(coupon.discountValue)) / 100);
    res.json({ data: { coupon, discount, payable: Math.max(0, input.amount - discount) } });
  })
);

export default router;
