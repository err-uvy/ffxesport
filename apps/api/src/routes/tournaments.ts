import { Router } from "express";
import { Game, Prisma, TournamentMode, TournamentStatus } from "@prisma/client";
import { z } from "zod";
import { buildTournamentCode, calculatePrizeDistribution, slugify } from "@/utils";
import { adminLog, audit } from "../lib/audit";
import { ApiError, asyncHandler } from "../lib/errors";
import { cacheJson, invalidateCache } from "../lib/redis";
import { emitRealtime } from "../lib/realtime";
import { prisma } from "../lib/prisma";
import { cleanRichText, cleanText, paginationSchema } from "../lib/validation";
import { requireRoles } from "../middleware/auth";
const router = Router();

const createTournamentSchema = z.object({
  title: z.string().min(3).max(120).transform(cleanText),
  game: z.nativeEnum(Game),
  mode: z.nativeEnum(TournamentMode),
  description: z.string().min(10).max(3000).transform(cleanRichText),
  bannerUrl: z.string().url().optional(),
  rules: z.string().min(10).max(5000).transform(cleanRichText),
  entryFee: z.coerce.number().min(0).default(0),
  prizePool: z.coerce.number().min(0).default(0),
  maxSlots: z.coerce.number().int().min(2).max(5000),
  minTeamSize: z.coerce.number().int().min(1).max(5).default(1),
  maxTeamSize: z.coerce.number().int().min(1).max(5).default(1),
  inviteOnly: z.boolean().default(false),
  inviteCode: z.string().trim().optional(),
  status: z.nativeEnum(TournamentStatus).default("REGISTRATION_OPEN"),
  registrationStartsAt: z.coerce.date(),
  registrationEndsAt: z.coerce.date(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  roomReleaseAt: z.coerce.date().optional()
});
type CreateTournamentInput = z.infer<typeof createTournamentSchema>;

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = paginationSchema
      .extend({
        game: z.nativeEnum(Game).optional(),
        status: z.nativeEnum(TournamentStatus).optional(),
        mode: z.nativeEnum(TournamentMode).optional()
      })
      .parse(req.query);

    const cacheKey = `tournaments:${JSON.stringify(query)}`;
    const data = await cacheJson(cacheKey, 30, async () => {
      const where: Prisma.TournamentWhereInput = {
        status: query.status ?? { not: "DRAFT" },
        game: query.game,
        mode: query.mode
      };
      const [total, tournaments] = await prisma.$transaction([
        prisma.tournament.count({ where }),
        prisma.tournament.findMany({
          where,
          orderBy: [{ startsAt: "asc" }],
          skip: (query.page - 1) * query.pageSize,
          take: query.pageSize,
          include: {
            matches: { orderBy: { startsAt: "asc" }, take: 1 },
            prizeDistributions: { orderBy: { rank: "asc" } }
          }
        })
      ]);
      return { data: tournaments, page: query.page, pageSize: query.pageSize, total };
    });

    res.json(data);
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const tournament = await prisma.tournament.findUnique({
      where: { slug: req.params.slug },
      include: {
        matches: { orderBy: { startsAt: "asc" } },
        prizeDistributions: { orderBy: { rank: "asc" } },
        participants: {
          include: {
            user: { select: { username: true, avatarUrl: true } },
            team: { select: { name: true, tag: true, logoUrl: true } }
          },
          orderBy: { slotNumber: "asc" }
        }
      }
    });
    if (!tournament || tournament.status === "DRAFT") throw new ApiError(404, "Tournament not found");
    res.json({ data: tournament });
  })
);

router.post(
  "/",
  requireRoles("SUPER_ADMIN", "ADMIN"),
  asyncHandler(async (req, res) => {
    const input: CreateTournamentInput =
  createTournamentSchema.parse(req.body);
    if (input.registrationEndsAt >= input.startsAt) {
      throw new ApiError(422, "Registration must end before tournament start");
    }
    const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
    const tournament = await prisma.tournament.create({
data: {
  title: input.title,
  game: input.game,
  mode: input.mode,
  description: input.description,
  bannerUrl: input.bannerUrl,
  rules: input.rules,

  entryFee: input.entryFee,
  prizePool: input.prizePool,
  maxSlots: input.maxSlots,
  minTeamSize: input.minTeamSize,
  maxTeamSize: input.maxTeamSize,

  inviteOnly: input.inviteOnly,
  inviteCode: input.inviteCode,

  status: input.status,

  registrationStartsAt: input.registrationStartsAt,
  registrationEndsAt: input.registrationEndsAt,

  startsAt: input.startsAt,
  endsAt: input.endsAt,

  roomReleaseAt: input.roomReleaseAt,

  slug,
  code: buildTournamentCode(),
  createdById: req.user!.id,

  prizeDistributions: {
    create: calculatePrizeDistribution(
      input.prizePool,
      Math.min(3, input.maxSlots)
    ).map((entry) => ({
      rank: entry.rank,
      amount: entry.amount
    }))
  },

  matches: {
    create: {
      round: 1,
      mapName: defaultMap(input.game),
      startsAt: input.startsAt,
      roomUnlockAt: input.roomReleaseAt,
      status: "ROOM_LOCKED",
      instructions:
        "Room ID and password unlock before match start. Join early and submit proof after match."
    }
  }
},
      include: { prizeDistributions: true, matches: true }
    });
    await invalidateCache("tournaments:*");
    await adminLog(req, { action: "CREATE_TOURNAMENT", targetType: "Tournament", targetId: tournament.id });
    emitRealtime("tournament:created", tournament);
    res.status(201).json({ data: tournament });
  })
);

router.patch(
  "/:id",
  requireRoles("SUPER_ADMIN", "ADMIN"),
  asyncHandler(async (req, res) => {
    const input: Partial<CreateTournamentInput> =
  createTournamentSchema.partial().parse(req.body);
    const tournament = await prisma.tournament.update({
      where: { id: req.params.id },
      data: input
    });
    await invalidateCache("tournaments:*");
    await adminLog(req, { action: "UPDATE_TOURNAMENT", targetType: "Tournament", targetId: tournament.id, metadata: input });
    emitRealtime("tournament:updated", tournament);
    res.json({ data: tournament });
  })
);

router.post(
  "/:id/join",
  asyncHandler(async (req, res) => {
    const input = z.object({ teamId: z.string().optional(), inviteCode: z.string().trim().optional() }).parse(req.body);
    const tournament = await prisma.tournament.findUnique({ where: { id: req.params.id } });
    if (!tournament) throw new ApiError(404, "Tournament not found");
    if (!["REGISTRATION_OPEN", "SCHEDULED"].includes(tournament.status)) {
      throw new ApiError(409, "Registration is closed");
    }
    if (tournament.registrationStartsAt > new Date() || tournament.registrationEndsAt < new Date()) {
      throw new ApiError(409, "Registration window is not active");
    }
    if (tournament.inviteOnly && tournament.inviteCode !== input.inviteCode) {
      throw new ApiError(403, "Invalid invite code");
    }
    if (tournament.filledSlots >= tournament.maxSlots) throw new ApiError(409, "Tournament is full");

    if (input.teamId) {
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        include: { members: { where: { status: "ACTIVE" } } }
      });
      if (!team || team.captainId !== req.user!.id) throw new ApiError(403, "Only the team captain can join");
      if (team.members.length < tournament.minTeamSize || team.members.length > tournament.maxTeamSize) {
        throw new ApiError(422, "Team size does not match tournament requirements");
      }
    } else if (tournament.maxTeamSize > 1) {
      throw new ApiError(422, "Team is required for this tournament");
    }

    const existing = await prisma.participant.findFirst({
      where: {
        tournamentId: tournament.id,
        OR: [{ userId: req.user!.id }, input.teamId ? { teamId: input.teamId } : { userId: req.user!.id }]
      }
    });
    if (existing) throw new ApiError(409, "Already joined");

    const entryFee = Number(tournament.entryFee);
    const participant = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: req.user!.id } });
      let paymentTxnId: string | undefined;

      if (entryFee > 0) {
        const available = Number(wallet.balance) + Number(wallet.bonusBalance);
        if (available < entryFee) throw new ApiError(402, "Insufficient wallet balance");
        const bonusUsed = Math.min(Number(wallet.bonusBalance), entryFee);
        const cashUsed = entryFee - bonusUsed;
        const txn = await tx.transaction.create({
          data: {
            userId: req.user!.id,
            walletId: wallet.id,
            type: "ENTRY_FEE",
            status: "SUCCESS",
            amount: entryFee,
            metadata: { tournamentId: tournament.id, bonusUsed, cashUsed }
          }
        });
        paymentTxnId = txn.id;
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            bonusBalance: { decrement: bonusUsed },
            balance: { decrement: cashUsed },
            lockedBalance: { increment: entryFee }
          }
        });
      }

      const updated = await tx.tournament.update({
        where: { id: tournament.id },
        data: { filledSlots: { increment: 1 } },
        select: { filledSlots: true }
      });

      return tx.participant.create({
        data: {
          tournamentId: tournament.id,
          userId: input.teamId ? undefined : req.user!.id,
          teamId: input.teamId,
          slotNumber: updated.filledSlots,
          paymentTxnId
        },
        include: { tournament: true, team: true, user: true }
      });
    });

    await audit(req, { action: "JOIN_TOURNAMENT", resource: "Tournament", resourceId: tournament.id });
    await invalidateCache("tournaments:*");
    emitRealtime("tournament:joined", { tournamentId: tournament.id, participant });
    res.status(201).json({ data: participant });
  })
);

router.post(
  "/:id/leave",
  asyncHandler(async (req, res) => {
    const participant = await prisma.participant.findFirst({
      where: {
        tournamentId: req.params.id,
        OR: [{ userId: req.user!.id }, { team: { captainId: req.user!.id } }]
      },
      include: { tournament: true, paymentTxn: true }
    });
    if (!participant) throw new ApiError(404, "Participant not found");
    if (participant.tournament.startsAt <= new Date()) throw new ApiError(409, "Cannot leave after match lock");

    await prisma.$transaction(async (tx) => {
      await tx.participant.update({ where: { id: participant.id }, data: { status: "LEFT" } });
      await tx.tournament.update({
        where: { id: participant.tournamentId },
        data: { filledSlots: { decrement: 1 } }
      });
      if (participant.paymentTxn) {
        await tx.transaction.create({
          data: {
            userId: req.user!.id,
            type: "REFUND",
            status: "SUCCESS",
            amount: participant.paymentTxn.amount,
            metadata: { tournamentId: participant.tournamentId, participantId: participant.id }
          }
        });
        await tx.wallet.update({
          where: { userId: req.user!.id },
          data: {
            balance: { increment: participant.paymentTxn.amount },
            lockedBalance: { decrement: participant.paymentTxn.amount }
          }
        });
      }
    });

    await invalidateCache("tournaments:*");
    emitRealtime("tournament:left", { tournamentId: participant.tournamentId, participantId: participant.id });
    res.json({ data: { ok: true }, message: "Left tournament and refunded eligible entry fee" });
  })
);

router.get(
  "/:id/leaderboard",
  asyncHandler(async (req, res) => {
    const participants = await prisma.participant.findMany({
      where: { tournamentId: req.params.id, status: { not: "LEFT" } },
      orderBy: [{ score: "desc" }, { kills: "desc" }, { placement: "asc" }],
      include: {
        user: { select: { username: true, avatarUrl: true } },
        team: { select: { name: true, tag: true, logoUrl: true } }
      }
    });
    res.json({ data: participants });
  })
);

function defaultMap(game: Game) {
  const maps: Record<Game, string> = {
    FREE_FIRE: "Bermuda Remastered",
    BGMI: "Erangel",
    CODM: "Isolated",
    VALORANT: "Ascent",
    BATTLE_ROYALE: "Main Arena"
  };
  return maps[game];
}

export default router;
