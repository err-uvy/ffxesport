import cron from "node-cron";
import { sendDiscordOps } from "../lib/discord";
import { prisma } from "../lib/prisma";
import { emitRealtime } from "../lib/realtime";

export function startAutomationJobs() {
  cron.schedule("* * * * *", async () => {
    await releaseRooms();
    await startLiveMatches();
    await sendMatchReminders();
  });
}

async function releaseRooms() {
  const matches = await prisma.match.findMany({
    where: {
      status: "ROOM_LOCKED",
      roomUnlockAt: { lte: new Date() },
      roomId: { not: null },
      roomPassword: { not: null }
    },
    include: { tournament: { include: { participants: true } } }
  });

  for (const match of matches) {
    await prisma.match.update({
      where: { id: match.id },
      data: { status: "ROOM_RELEASED" }
    });
    const userIds = match.tournament.participants.map((participant) => participant.userId).filter(Boolean) as string[];
    if (userIds.length) {
      await prisma.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          type: "MATCH",
          title: "Room unlocked",
          body: `${match.tournament.title} room ID and password are now available.`,
          data: { matchId: match.id, tournamentId: match.tournamentId }
        }))
      });
    }
    emitRealtime("match:room-released", { matchId: match.id, tournamentId: match.tournamentId });
    await sendDiscordOps(`Room released for ${match.tournament.title}`);
  }
}

async function startLiveMatches() {
  const matches = await prisma.match.findMany({
    where: {
      status: "ROOM_RELEASED",
      startsAt: { lte: new Date() }
    },
    include: { tournament: true }
  });
  for (const match of matches) {
    await prisma.match.update({ where: { id: match.id }, data: { status: "LIVE" } });
    await prisma.tournament.update({ where: { id: match.tournamentId }, data: { status: "LIVE" } });
    emitRealtime("match:live", { matchId: match.id, tournamentId: match.tournamentId });
  }
}

async function sendMatchReminders() {
  const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);
  const matches = await prisma.match.findMany({
    where: {
      startsAt: { gte: new Date(), lte: tenMinutesFromNow },
      status: { in: ["ROOM_LOCKED", "ROOM_RELEASED"] }
    },
    include: { tournament: { include: { participants: true } } }
  });
  for (const match of matches) {
    const userIds = match.tournament.participants.map((participant) => participant.userId).filter(Boolean) as string[];
    if (!userIds.length) continue;
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: "MATCH",
        title: "Match starts soon",
        body: `${match.tournament.title} starts in less than 10 minutes.`,
        data: { matchId: match.id, tournamentId: match.tournamentId }
      })),
      skipDuplicates: true
    });
    emitRealtime("match:countdown", { matchId: match.id, startsAt: match.startsAt });
  }
}
