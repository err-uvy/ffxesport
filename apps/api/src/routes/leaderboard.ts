import { Router } from "express";
import { Game } from "@prisma/client";
import { z } from "zod";
import { asyncHandler } from "../lib/errors";
import { cacheJson } from "../lib/redis";
import { prisma } from "../lib/prisma";

const router = Router();

router.get(
  "/global",
  asyncHandler(async (req, res) => {
    const query = z.object({ game: z.nativeEnum(Game).optional(), scope: z.enum(["daily", "weekly", "monthly", "all"]).default("all") }).parse(req.query);
    const data = await cacheJson(`leaderboard:global:${query.game ?? "all"}:${query.scope}`, 60, async () => {
      const profiles = await prisma.gameProfile.findMany({
        where: { game: query.game },
        orderBy: [{ earnings: "desc" }, { kdRatio: "desc" }],
        take: 100,
        include: {
          user: { select: { username: true, avatarUrl: true } }
        }
      });
      return profiles;
    });
    res.json({ data });
  })
);

router.get(
  "/earnings",
  asyncHandler(async (_req, res) => {
    const data = await cacheJson("leaderboard:earnings", 60, async () =>
      prisma.gameProfile.findMany({
        orderBy: { earnings: "desc" },
        take: 100,
        include: { user: { select: { username: true, avatarUrl: true } } }
      })
    );
    res.json({ data });
  })
);

router.get(
  "/kills",
  asyncHandler(async (_req, res) => {
    const participants = await prisma.participant.groupBy({
      by: ["userId"],
      where: { userId: { not: null } },
      _sum: { kills: true, score: true },
      orderBy: { _sum: { kills: "desc" } },
      take: 100
    });
    const userIds = participants.map((entry) => entry.userId).filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, avatarUrl: true }
    });
    res.json({
      data: participants.map((entry) => ({
        ...entry,
        user: users.find((user) => user.id === entry.userId)
      }))
    });
  })
);

router.get(
  "/clans",
  asyncHandler(async (_req, res) => {
    const teams = await prisma.team.findMany({
      include: {
        members: { where: { status: "ACTIVE" } },
        participants: true
      },
      take: 100
    });
    res.json({
      data: teams
        .map((team) => ({
          id: team.id,
          name: team.name,
          tag: team.tag,
          logoUrl: team.logoUrl,
          members: team.members.length,
          score: team.participants.reduce((sum, participant) => sum + participant.score, 0),
          kills: team.participants.reduce((sum, participant) => sum + participant.kills, 0)
        }))
        .sort((a, b) => b.score - a.score)
    });
  })
);

export default router;
