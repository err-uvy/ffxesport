import { Router } from "express";
import { TicketPriority } from "@prisma/client";
import { z } from "zod";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { cleanText } from "../lib/validation";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user!.id },
      include: { replies: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ data: tickets });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        subject: z.string().min(4).max(120).transform(cleanText),
        category: z.string().min(2).max(40).transform(cleanText),
        priority: z.nativeEnum(TicketPriority).default("MEDIUM"),
        body: z.string().min(10).max(3000).transform(cleanText)
      })
      .parse(req.body);
    const ticket = await prisma.ticket.create({
      data: {
        userId: req.user!.id,
        subject: input.subject,
        category: input.category,
        priority: input.priority,
        replies: {
          create: {
            userId: req.user!.id,
            body: input.body
          }
        }
      },
      include: { replies: true }
    });
    res.status(201).json({ data: ticket });
  })
);

router.post(
  "/:id/replies",
  asyncHandler(async (req, res) => {
    const input = z.object({ body: z.string().min(2).max(3000).transform(cleanText) }).parse(req.body);
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket || ticket.userId !== req.user!.id) throw new ApiError(404, "Ticket not found");
    const reply = await prisma.ticketReply.create({
      data: {
        ticketId: ticket.id,
        userId: req.user!.id,
        body: input.body
      }
    });
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: "PENDING_SUPPORT" }
    });
    res.status(201).json({ data: reply });
  })
);

export default router;
