import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { RoleName, User } from "@prisma/client";
import { env } from "../config/env";

export type TokenPayload = {
  sub: string;
  roles?: RoleName[];
  type: "access" | "refresh";
  jti?: string;
  familyId?: string;
  sessionId?: string;
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function sha256(value: string) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto
    .randomBytes(bytes)
    .toString("hex");
}

export function generateOtp() {
  return String(
    crypto.randomInt(100000, 999999)
  );
}

export function signAccessToken(input: {
  userId: string;
  roles: RoleName[];
  sessionId?: string;
}) {
  const payload: TokenPayload = {
    sub: input.userId,
    roles: input.roles,
    sessionId: input.sessionId,
    type: "access"
  };

  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"]
    }
  );
}

export function signRefreshToken(input: {
  userId: string;
  familyId: string;
  tokenId: string;
}) {
  const payload: TokenPayload = {
    sub: input.userId,
    familyId: input.familyId,
    jti: input.tokenId,
    type: "refresh"
  };

  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`
    }
  );
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as TokenPayload;

  if (payload.type !== "access") {
    throw new Error(
      "Invalid access token"
    );
  }

  return payload;
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as TokenPayload;

  if (payload.type !== "refresh") {
    throw new Error(
      "Invalid refresh token"
    );
  }

  return payload;
}

export function refreshExpiry() {
  return new Date(
    Date.now() +
      env.REFRESH_TOKEN_TTL_DAYS *
        24 *
        60 *
        60 *
        1000
  );
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/"
  };

  // ACCESS TOKEN
  res.cookie(
    "ffx_access",
    accessToken,
    {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    }
  );

  // REFRESH TOKEN
  res.cookie(
    "ffx_refresh",
    refreshToken,
    {
      ...cookieOptions,
      maxAge:
        env.REFRESH_TOKEN_TTL_DAYS *
        24 *
        60 *
        60 *
        1000
    }
  );

  // CSRF TOKEN
  res.cookie(
    "ffx_csrf",
    crypto.randomUUID(),
    {
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge:
        24 *
        60 *
        60 *
        1000
    }
  );
}

export function clearAuthCookies(
  res: Response
) {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/"
  };

  res.clearCookie(
    "ffx_access",
    cookieOptions
  );

  res.clearCookie(
    "ffx_refresh",
    cookieOptions
  );

  res.clearCookie(
    "ffx_csrf",
    {
      secure: true,
      sameSite: "none",
      path: "/"
    }
  );
}

export function safeUser(
  user: User & {
    roles?: {
      role: {
        name: RoleName;
      };
    }[];
  }
) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    status: user.status,
    emailVerified:
      user.emailVerified,
    roles:
      user.roles?.map(
        (entry) =>
          entry.role.name
      ) ?? []
  };
}