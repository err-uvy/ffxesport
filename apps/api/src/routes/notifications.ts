import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    res.json({ data: notifications });
  })
);

router.patch(
  "/read-all",
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, readAt: null },
      data: { readAt: new Date() }
    });
    res.json({ data: { ok: true } });
  })
);

router.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification || notification.userId !== req.user!.id) throw new ApiError(404, "Notification not found");
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { readAt: new Date() }
    });
    res.json({ data: updated });
  })
);

router.post(
  "/fcm-token",
  asyncHandler(async (req, res) => {
    const input = z.object({ token: z.string().min(20), platform: z.string().optional() }).parse(req.body);
    const token = await prisma.pushToken.upsert({
      where: { token: input.token },
      create: { userId: req.user!.id, token: input.token, platform: input.platform },
      update: { userId: req.user!.id, platform: input.platform }
    });
    res.status(201).json({ data: token });
  })
);

export default router;
