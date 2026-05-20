import type { NextFunction, Request, Response } from "express";
import type { RoleName } from "@prisma/client";
import { ApiError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { verifyAccessToken } from "../lib/auth";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice("Bearer ".length)
      : undefined;
    const token = bearer ?? req.cookies?.ffx_access;
    if (!token) throw new ApiError(401, "Authentication required");

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: {
        id: payload.sub,
        deletedAt: null,
        status: { not: "BANNED" }
      },
      include: { roles: { include: { role: true } } }
    });
    if (!user) throw new ApiError(401, "Invalid session");
    if (user.status === "SUSPENDED") throw new ApiError(403, "Account suspended");

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((entry) => entry.role.name),
      sessionId: payload.sessionId
    };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, "Invalid or expired token"));
  }
}

export function requireRoles(...roles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!req.user.roles.some((role) => roles.includes(role as any))) {
      return next(new ApiError(403, "Forbidden"));
    }
    return next();
  };
}

export const adminRoles: RoleName[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"];

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRoles(...adminRoles)(req, res, next);
}
