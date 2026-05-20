import { RoleName } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username?: string;
        email?: string;
        roles?: RoleName[];
        sessionId?: string;
      };

      rawBody?: Buffer | string;
    }

    namespace Multer {
      interface File {
        filename: string;
        path: string;
      }
    }
  }
}

export {};