import type { RoleName } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        roles: RoleName[];
        sessionId?: string;
      };
      rawBody?: Buffer;
    }
  }
}
