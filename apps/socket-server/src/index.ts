import { createServer } from "node:http";
import cookie from "cookie";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { z } from "zod";
import { corsOrigins, env } from "./env";
import { prisma } from "./prisma";

type AccessPayload = {
  sub: string;
  roles?: string[];
  type: "access";
};

type SocketUser = {
  id: string;
  username: string;
  roles: string[];
  service?: boolean;
};

declare module "socket.io" {
  interface Socket {
    user?: SocketUser;
  }
}

const app = express();
app.use(cors({ origin: corsOrigins, credentials: true }));
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ffx-socket", at: new Date().toISOString() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    credentials: true
  }
});

if (env.REDIS_URL) {
  const pubClient = new Redis(env.REDIS_URL);
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
}

io.use(async (socket, next) => {
  try {
    if (socket.handshake.auth?.serviceToken === env.JWT_ACCESS_SECRET) {
      socket.user = { id: "service", username: "service", roles: ["SUPER_ADMIN"], service: true };
      return next();
    }

    const cookies = cookie.parse(socket.handshake.headers.cookie ?? "");
    const token =
      typeof socket.handshake.auth?.token === "string" ? socket.handshake.auth.token : cookies.ffx_access;
    if (!token) throw new Error("Missing token");
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
    if (payload.type !== "access") throw new Error("Invalid token type");
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: { include: { role: true } } }
    });
    if (!user || user.status === "BANNED" || user.status === "SUSPENDED") throw new Error("Invalid user");
    socket.user = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((entry) => entry.role.name)
    };
    socket.join(`user:${user.id}`);
    return next();
  } catch {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.emit("connected", {
    userId: socket.user?.id,
    at: new Date().toISOString()
  });

  socket.on("service:event", (message: { event: string; payload: unknown }) => {
    if (!socket.user?.service) return;
    routeServiceEvent(message.event, message.payload);
  });

  socket.on("tournament:join", async (payload: { tournamentId: string }) => {
    const input = z.object({ tournamentId: z.string() }).parse(payload);
    const participant = await prisma.participant.findFirst({
      where: {
        tournamentId: input.tournamentId,
        OR: [
          { userId: socket.user!.id },
          { team: { members: { some: { userId: socket.user!.id, status: "ACTIVE" } } } }
        ]
      }
    });
    if (!participant) return socket.emit("error:message", "Join the tournament before opening live updates.");
    socket.join(`tournament:${input.tournamentId}`);
    const count = await prisma.participant.count({ where: { tournamentId: input.tournamentId, status: { not: "LEFT" } } });
    io.to(`tournament:${input.tournamentId}`).emit("tournament:participant-count", {
      tournamentId: input.tournamentId,
      count
    });
  });

  socket.on("team:join", async (payload: { teamId: string }) => {
    const input = z.object({ teamId: z.string() }).parse(payload);
    const member = await prisma.teamMember.findFirst({
      where: { teamId: input.teamId, userId: socket.user!.id, status: "ACTIVE" }
    });
    if (!member) return socket.emit("error:message", "You are not an active team member.");
    socket.join(`team:${input.teamId}`);
  });

  socket.on("chat:tournament", async (payload: { tournamentId: string; body: string }) => {
    const input = z.object({ tournamentId: z.string(), body: z.string().min(1).max(500) }).parse(payload);
    const participant = await prisma.participant.findFirst({
      where: {
        tournamentId: input.tournamentId,
        OR: [
          { userId: socket.user!.id },
          { team: { members: { some: { userId: socket.user!.id, status: "ACTIVE" } } } }
        ]
      }
    });
    if (!participant) return;
    const message = await prisma.chatMessage.create({
      data: {
        tournamentId: input.tournamentId,
        userId: socket.user!.id,
        body: input.body
      },
      include: { user: { select: { username: true, avatarUrl: true } } }
    });
    io.to(`tournament:${input.tournamentId}`).emit("chat:tournament", message);
  });

  socket.on("chat:team", async (payload: { teamId: string; body: string }) => {
    const input = z.object({ teamId: z.string(), body: z.string().min(1).max(500) }).parse(payload);
    const member = await prisma.teamMember.findFirst({
      where: { teamId: input.teamId, userId: socket.user!.id, status: "ACTIVE" }
    });
    if (!member) return;
    const message = await prisma.chatMessage.create({
      data: {
        teamId: input.teamId,
        userId: socket.user!.id,
        body: input.body
      },
      include: { user: { select: { username: true, avatarUrl: true } } }
    });
    io.to(`team:${input.teamId}`).emit("chat:team", message);
  });
});

function routeServiceEvent(event: string, payload: unknown) {
  if (event.startsWith("match:")) {
    const typed = payload as { tournamentId?: string; matchId?: string };
    if (typed.tournamentId) io.to(`tournament:${typed.tournamentId}`).emit(event, payload);
    io.emit(event, payload);
    return;
  }
  if (event.startsWith("tournament:")) {
    const typed = payload as { tournamentId?: string; id?: string };
    const tournamentId = typed.tournamentId ?? typed.id;
    if (tournamentId) io.to(`tournament:${tournamentId}`).emit(event, payload);
    io.emit(event, payload);
    return;
  }
  if (event.startsWith("wallet:") || event.startsWith("notification:")) {
    const typed = payload as { userId?: string };
    if (typed.userId) io.to(`user:${typed.userId}`).emit(event, payload);
    return;
  }
  io.emit(event, payload);
}

httpServer.listen(env.SOCKET_PORT, () => {
  console.log(`FFX ESPORTS Socket.IO listening on http://localhost:${env.SOCKET_PORT}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function shutdown() {
  httpServer.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
