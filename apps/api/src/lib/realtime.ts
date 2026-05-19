import { io, type Socket } from "socket.io-client";
import { env } from "../config/env";

let socket: Socket | null = null;

function getSocket() {
  if (!socket) {
    socket = io(`http://localhost:${env.SOCKET_PORT}`, {
      auth: { serviceToken: env.JWT_ACCESS_SECRET },
      transports: ["websocket"],
      autoConnect: false
    });
  }
  if (!socket.connected) socket.connect();
  return socket;
}

export function emitRealtime(event: string, payload: unknown) {
  try {
    getSocket().emit("service:event", { event, payload });
  } catch {
    // Realtime is best-effort from the API; durable state remains in Postgres.
  }
}
