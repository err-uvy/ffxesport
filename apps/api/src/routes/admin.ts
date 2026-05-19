import { Router } from "express";
import { RoleName, UserStatus, WithdrawalStatus } from "@prisma/client";
import { z } from "zod";
import { adminLog } from "../lib/audit";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { emitRealtime } from "../lib/realtime";
import { paginationSchema } from "../lib/validation";
import { requireAdmin, requireRoles } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);

router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const [
      users,
      activeTournaments,
      liveMatches,
      pendingWithdrawals,
      pendingResults,
      depositVolume,
      fraudHigh
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.tournament.count({ where: { status: { in: ["REGISTRATION_OPEN", "LIVE", "SCHEDULED"] } } }),
      prisma.match.count({ where: { status: { in: ["ROOM_RELEASED", "LIVE", "RESULT_PENDING"] } } }),
      prisma.withdrawalRequest.count({ where: { status: "REQUESTED" } }),
      prisma.resultSubmission.count({ where: { status: "PENDING" } }),
      prisma.transaction.aggregate({
        where: { type: "DEPOSIT", status: "SUCCESS" },
        _sum: { amount: true }
      }),
      prisma.fraudLog.count({ where: { severity: { in: ["HIGH", "CRITICAL"] }, resolvedAt: null } })
    ]);

    res.json({
      data: {
        users,
        activeTournaments,
        liveMatches,
        pendingWithdrawals,
        pendingResults,
        depositVolume: depositVolume._sum.amount ?? 0,
        fraudHigh
      }
    });
  })
);

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const query = paginationSchema.extend({ search: z.string().optional() }).parse(req.query);
    const where = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: "insensitive" as const } },
            { username: { contains: query.search, mode: "insensitive" as const } }
          ]
        }
      : {};
    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: { roles: { include: { role: true } }, wallet: true, gameProfiles: true },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      })
    ]);
    res.json({ data: users, page: query.page, pageSize: query.pageSize, total });
  })
);

router.patch(
  "/users/:id/status",
  requireRoles("SUPER_ADMIN", "ADMIN", "SUPPORT"),
  asyncHandler(async (req, res) => {
    const input = z.object({ status: z.nativeEnum(UserStatus), reason: z.string().optional() }).parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: input.status }
    });
    await adminLog(req, {
      action: "UPDATE_USER_STATUS",
      targetType: "User",
      targetId: user.id,
      metadata: input
    });
    res.json({ data: user });
  })
);

router.post(
  "/users/:id/roles",
  requireRoles("SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const input = z.object({ role: z.nativeEnum(RoleName), grant: z.boolean().default(true) }).parse(req.body);
    const targetUserId = req.params.id;
    if (!targetUserId) throw new ApiError(422, "User id is required");
    const role = await prisma.role.upsert({
      where: { name: input.role },
      create: { name: input.role, description: `${input.role} role` },
      update: {}
    });
    if (input.grant) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: targetUserId, roleId: role.id } },
        create: { userId: targetUserId, roleId: role.id, assignedById: req.user!.id },
        update: {}
      });
    } else {
      await prisma.userRole.deleteMany({ where: { userId: targetUserId, roleId: role.id } });
    }
    await adminLog(req, {
      action: input.grant ? "GRANT_ROLE" : "REVOKE_ROLE",
      targetType: "User",
      targetId: targetUserId,
      metadata: { role: input.role }
    });
    res.json({ data: { ok: true } });
  })
);

router.get(
  "/tournaments",
  requireRoles("SUPER_ADMIN", "ADMIN", "MODERATOR"),
  asyncHandler(async (_req, res) => {
    const tournaments = await prisma.tournament.findMany({
      include: {
        matches: true,
        participants: true,
        prizeDistributions: { orderBy: { rank: "asc" } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    res.json({ data: tournaments });
  })
);

router.patch(
  "/matches/:id/room",
  requireRoles("SUPER_ADMIN", "ADMIN", "MODERATOR"),
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        roomId: z.string().min(2),
        roomPassword: z.string().min(2),
        roomUnlockAt: z.coerce.date().optional(),
        status: z.enum(["ROOM_LOCKED", "ROOM_RELEASED", "LIVE"]).default("ROOM_RELEASED")
      })
      .parse(req.body);
    const match = await prisma.match.update({
      where: { id: req.params.id },
      data: input,
      include: { tournament: { include: { participants: true } } }
    });
    const userIds = match.tournament.participants.map((participant) => participant.userId).filter(Boolean) as string[];
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: "MATCH",
        title: "Room released",
        body: `${match.tournament.title} room details are live.`,
        data: { matchId: match.id, tournamentId: match.tournamentId }
      }))
    });
    await adminLog(req, { action: "RELEASE_ROOM", targetType: "Match", targetId: match.id });
    emitRealtime("match:room-released", { matchId: match.id, tournamentId: match.tournamentId });
    res.json({ data: match });
  })
);

router.patch(
  "/results/:id/verify",
  requireRoles("SUPER_ADMIN", "ADMIN", "MODERATOR"),
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        status: z.enum(["VERIFIED", "REJECTED"]),
        adminNote: z.string().optional()
      })
      .parse(req.body);
    const result = await prisma.resultSubmission.update({
      where: { id: req.params.id },
      data: {
        status: input.status,
        adminNote: input.adminNote,
        verifiedById: req.user!.id
      },
      include: { participant: true, match: true }
    });
    if (input.status === "VERIFIED") {
      await prisma.participant.update({
        where: { id: result.participantId },
        data: {
          kills: result.kills,
          placement: result.placement,
          score: result.score
        }
      });
    }
    await adminLog(req, {
      action: "VERIFY_RESULT",
      targetType: "ResultSubmission",
      targetId: result.id,
      metadata: input
    });
    emitRealtime("match:result-verified", { matchId: result.matchId, resultId: result.id });
    res.json({ data: result });
  })
);

router.get(
  "/results",
  requireRoles("SUPER_ADMIN", "ADMIN", "MODERATOR"),
  asyncHandler(async (_req, res) => {
    const results = await prisma.resultSubmission.findMany({
      where: { status: "PENDING" },
      include: {
        submittedBy: { select: { username: true, email: true } },
        participant: {
          include: {
            user: { select: { username: true } },
            team: { select: { name: true, tag: true } }
          }
        },
        match: { include: { tournament: { select: { title: true, game: true } } } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    res.json({ data: results });
  })
);

router.post(
  "/tournaments/:id/complete",
  requireRoles("SUPER_ADMIN", "ADMIN"),
  asyncHandler(async (req, res) => {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: {
        participants: {
          where: { status: { not: "LEFT" } },
          include: { paymentTxn: true, team: { include: { members: { where: { status: "ACTIVE" } } } } },
          orderBy: [{ score: "desc" }, { kills: "desc" }, { placement: "asc" }]
        },
        prizeDistributions: { orderBy: { rank: "asc" } }
      }
    });
    if (!tournament) throw new ApiError(404, "Tournament not found");

    await prisma.$transaction(async (tx) => {
      for (const participant of tournament.participants) {
        if (participant.paymentTxn) {
          await tx.wallet.update({
            where: { userId: participant.paymentTxn.userId },
            data: { lockedBalance: { decrement: participant.paymentTxn.amount } }
          });
        }
      }

      for (const prize of tournament.prizeDistributions) {
        const participant = tournament.participants[prize.rank - 1];
        if (!participant) continue;
        const winnerIds = participant.userId
          ? [participant.userId]
          : participant.team?.members.map((member) => member.userId) ?? [];
        const split = Number(prize.amount) / Math.max(winnerIds.length, 1);
        for (const userId of winnerIds) {
          await tx.wallet.update({
            where: { userId },
            data: { winningBalance: { increment: split } }
          });
          await tx.transaction.create({
            data: {
              userId,
              type: "WINNING",
              status: "SUCCESS",
              amount: split,
              reference: `WIN-${tournament.code}-${prize.rank}-${userId.slice(-4)}`,
              metadata: { tournamentId: tournament.id, rank: prize.rank }
            }
          });
          await tx.notification.create({
            data: {
              userId,
              type: "WALLET",
              title: "Prize credited",
              body: `You won INR ${Math.round(split)} in ${tournament.title}.`,
              data: { tournamentId: tournament.id, rank: prize.rank }
            }
          });
        }
      }

      await tx.tournament.update({
        where: { id: tournament.id },
        data: { status: "COMPLETED", endsAt: new Date() }
      });
    });

    await adminLog(req, { action: "COMPLETE_TOURNAMENT", targetType: "Tournament", targetId: tournament.id });
    emitRealtime("tournament:completed", { tournamentId: tournament.id });
    res.json({ data: { ok: true } });
  })
);

router.get(
  "/withdrawals",
  requireRoles("SUPER_ADMIN", "ADMIN"),
  asyncHandler(async (req, res) => {
    const query = paginationSchema.extend({ status: z.nativeEnum(WithdrawalStatus).optional() }).parse(req.query);
    const where = { status: query.status };
    const [total, withdrawals] = await prisma.$transaction([
      prisma.withdrawalRequest.count({ where }),
      prisma.withdrawalRequest.findMany({
        where,
        include: { user: { select: { username: true, email: true } }, transaction: true },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      })
    ]);
    res.json({ data: withdrawals, page: query.page, pageSize: query.pageSize, total });
  })
);

router.patch(
  "/withdrawals/:id",
  requireRoles("SUPER_ADMIN", "ADMIN"),
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        status: z.enum(["APPROVED", "REJECTED", "PAID"]),
        adminNote: z.string().optional()
      })
      .parse(req.body);
    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id: req.params.id },
      include: { transaction: true }
    });
    if (!withdrawal) throw new ApiError(404, "Withdrawal not found");

    const updated = await prisma.$transaction(async (tx) => {
      if (input.status === "REJECTED" && withdrawal.status !== "REJECTED") {
        await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            winningBalance: { increment: withdrawal.amount },
            lockedBalance: { decrement: withdrawal.amount }
          }
        });
        await tx.transaction.update({
          where: { id: withdrawal.transactionId },
          data: { status: "CANCELLED" }
        });
      }
      if (input.status === "PAID" && withdrawal.status !== "PAID") {
        await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: { lockedBalance: { decrement: withdrawal.amount } }
        });
        await tx.transaction.update({
          where: { id: withdrawal.transactionId },
          data: { status: "SUCCESS" }
        });
      }
      return tx.withdrawalRequest.update({
        where: { id: withdrawal.id },
        data: { status: input.status, adminNote: input.adminNote }
      });
    });

    await adminLog(req, { action: "UPDATE_WITHDRAWAL", targetType: "WithdrawalRequest", targetId: withdrawal.id, metadata: input });
    emitRealtime("wallet:withdrawal-updated", { userId: withdrawal.userId, withdrawalId: withdrawal.id });
    res.json({ data: updated });
  })
);

router.get(
  "/audit-logs",
  requireRoles("SUPER_ADMIN", "ADMIN"),
  asyncHandler(async (req, res) => {
    const query = paginationSchema.parse(req.query);
    const logs = await prisma.auditLog.findMany({
      include: { actor: { select: { username: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize
    });
    res.json({ data: logs });
  })
);

router.get(
  "/fraud-logs",
  requireRoles("SUPER_ADMIN", "ADMIN", "MODERATOR"),
  asyncHandler(async (_req, res) => {
    const logs = await prisma.fraudLog.findMany({
      include: { user: { select: { username: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    res.json({ data: logs });
  })
);

router.get(
  "/tickets",
  requireRoles("SUPER_ADMIN", "ADMIN", "SUPPORT"),
  asyncHandler(async (_req, res) => {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: { select: { username: true, email: true } },
        replies: { include: { user: { select: { username: true } } }, orderBy: { createdAt: "asc" } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    res.json({ data: tickets });
  })
);

router.patch(
  "/tickets/:id",
  requireRoles("SUPER_ADMIN", "ADMIN", "SUPPORT"),
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        status: z.enum(["OPEN", "PENDING_USER", "PENDING_SUPPORT", "RESOLVED", "CLOSED"]),
        reply: z.string().optional(),
        internal: z.boolean().default(false)
      })
      .parse(req.body);
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        status: input.status,
        replies: input.reply
          ? {
              create: {
                userId: req.user!.id,
                body: input.reply,
                internal: input.internal
              }
            }
          : undefined
      },
      include: { replies: true }
    });
    await adminLog(req, { action: "UPDATE_TICKET", targetType: "Ticket", targetId: ticket.id, metadata: input });
    res.json({ data: ticket });
  })
);

export default router;
