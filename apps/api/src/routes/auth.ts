import crypto from "node:crypto";
import { Router } from "express";
import type { RoleName, User } from "@prisma/client";
import { z } from "zod";
import { env } from "../config/env";
import {
  clearAuthCookies,
  generateOtp,
  hashPassword,
  randomToken,
  refreshExpiry,
  safeUser,
  setAuthCookies,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken
} from "../lib/auth";
import { audit } from "../lib/audit";
import { ApiError, asyncHandler } from "../lib/errors";
import { sendMail } from "../lib/mailer";
import { prisma } from "../lib/prisma";
import { cleanText, emailSchema, passwordSchema } from "../lib/validation";
import { requireAuth } from "../middleware/auth";

const router = Router();

const adminRoleSet = new Set<RoleName>(["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"]);

async function rolesForUser(userId: string) {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return roles.map((entry) => entry.role.name);
}

async function issueTokens(input: {
  user: User;
  roles: RoleName[];
  ip?: string;
  userAgent?: string;
  fingerprint?: string;
}) {
  const session = await prisma.userSession.create({
    data: {
      userId: input.user.id,
      deviceFingerprint: input.fingerprint,
      ip: input.ip,
      userAgent: input.userAgent,
      expiresAt: refreshExpiry()
    }
  });

  const familyId = crypto.randomUUID();
  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken({
    userId: input.user.id,
    roles: input.roles,
    sessionId: session.id
  });
  const refreshToken = signRefreshToken({
    userId: input.user.id,
    familyId,
    tokenId
  });
  const refreshTokenHash = sha256(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: input.user.id,
      tokenHash: refreshTokenHash,
      familyId,
      deviceId: input.fingerprint,
      ip: input.ip,
      expiresAt: refreshExpiry()
    }
  });

  if (input.roles.some((role) => adminRoleSet.has(role))) {
    await prisma.adminSession.create({
      data: {
        userId: input.user.id,
        refreshTokenHash,
        ip: input.ip,
        userAgent: input.userAgent,
        expiresAt: refreshExpiry()
      }
    });
  }

  return { accessToken, refreshToken, sessionId: session.id };
}

function referralCode(username: string) {
  return `${username.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}
const registerSchema = z.object({
  email: emailSchema,
  username: z.string().min(3).max(24).transform(cleanText),
  password: passwordSchema,
  phone: z.string().min(7).max(20).optional(),
  referrerCode: z.string().optional(),
  deviceFingerprint: z.string().optional()
});

router.get("/csrf", (req, res) => {
  res.json({ data: { csrfToken: req.cookies?.ffx_csrf } });
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body) as any;
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] }
    });
    if (existing) throw new ApiError(409, "Email or username already registered");

  const referrer = input.referrerCode
  ? await prisma.user.findFirst({
      where: {
        referralCode: input.referrerCode as string
      }
    })
  : null;
    const passwordHash = await hashPassword(input.password);
    const code = generateOtp();
    const user = await prisma.user.create({
  data: {
    email: input.email as string,
    username: input.username as string,
    passwordHash,
    phone: (input.phone as string) || null,
    referralCode: referralCode(input.username as string),
    referredById: referrer?.id,

    wallet: {
      create: {}
    },

    roles: {
      create: {
        role: {
          connectOrCreate: {
            where: {
              name: "USER"
            },
            create: {
              name: "USER",
              description: "Player account"
            }
          }
        }
      }
    },

    otpCodes: {
      create: {
        email: input.email as string,
        codeHash: sha256(code),
        purpose: "EMAIL_VERIFY",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    }
  },

  include: {
    roles: {
      include: {
        role: true
      }
    }
  }
});
    if (referrer) {
      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: user.id,
          rewardAmount: 25
        }
      });
    }

    await sendMail({
      to: user.email,
      subject: "Verify your FFX ESPORTS account",
      text: `Your FFX ESPORTS OTP is ${code}. It expires in 10 minutes.`,
      html: `<p>Your FFX ESPORTS OTP is <strong>${code}</strong>. It expires in 10 minutes.</p>`
    });

    const roles = (user.roles ?? []).map(
  (entry: any) => entry.role.name as RoleName
);
    const tokens = await issueTokens({
      user,
      roles,
      ip: req.ip,
      userAgent: req.header("user-agent"),
      fingerprint: input.deviceFingerprint as string
    });
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    await audit(req, { action: "REGISTER", resource: "User", resourceId: user.id });

    res.status(201).json({ data: safeUser(user), message: "Account created" });
  })
);

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  deviceFingerprint: z.string().optional()
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { roles: { include: { role: true } } }
    });
    if (!user?.passwordHash) throw new ApiError(401, "Invalid credentials");
    if (user.status === "BANNED") throw new ApiError(403, "Account banned");
    if (user.status === "SUSPENDED") throw new ApiError(403, "Account suspended");

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid credentials");

    const roles = (user.roles ?? []).map(
  (entry: any) => entry.role.name as RoleName
);
    const tokens = await issueTokens({
      user,
      roles,
      ip: req.ip,
      userAgent: req.header("user-agent"),
      fingerprint: input.deviceFingerprint as string
    });
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    await audit(req, { action: "LOGIN", resource: "User", resourceId: user.id });

    res.json({ data: safeUser(user), message: "Logged in" });
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.ffx_refresh;
    if (!token) throw new ApiError(401, "Refresh token missing");
    const payload = verifyRefreshToken(token);
    const tokenHash = sha256(token);

    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { roles: { include: { role: true } } } } }
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      if (payload.familyId) {
        await prisma.refreshToken.updateMany({
          where: { familyId: payload.familyId },
          data: { revokedAt: new Date() }
        });
      }
      clearAuthCookies(res);
      throw new ApiError(401, "Refresh token invalid");
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    const roles = stored.user.roles.map((entry) => entry.role.name);
    const tokenId = crypto.randomUUID();
    const refreshToken = signRefreshToken({
      userId: stored.userId,
      familyId: stored.familyId,
      tokenId
    });
    const accessToken = signAccessToken({ userId: stored.userId, roles });
    const refreshTokenHash = sha256(refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: stored.userId,
        familyId: stored.familyId,
        tokenHash: refreshTokenHash,
        deviceId: stored.deviceId,
        ip: req.ip,
        expiresAt: refreshExpiry()
      }
    });
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ data: safeUser(stored.user) });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.ffx_refresh;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { tokenHash: sha256(token), revokedAt: null },
        data: { revokedAt: new Date() }
      });
      await prisma.adminSession.updateMany({
        where: { refreshTokenHash: sha256(token), revokedAt: null },
        data: { revokedAt: new Date() }
      });
    }
    clearAuthCookies(res);
    res.json({ data: { ok: true }, message: "Logged out" });
  })
);

router.post(
  "/logout-all",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.refreshToken.updateMany({
      where: { userId: req.user!.id, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    await prisma.userSession.updateMany({
      where: { userId: req.user!.id, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    await prisma.adminSession.updateMany({
      where: { userId: req.user!.id, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    clearAuthCookies(res);
    res.json({ data: { ok: true }, message: "All sessions revoked" });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.id },
      include: {
        roles: { include: { role: true } },
        gameProfiles: true,
        wallet: true
      }
    });
    res.json({ data: { ...safeUser(user), gameProfiles: user.gameProfiles, wallet: user.wallet } });
  })
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const input = z.object({ email: emailSchema }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (user) {
      const token = randomToken();
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: sha256(token),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000)
        }
      });
      const link = `${env.WEB_APP_URL}/reset-password?token=${token}`;
      await sendMail({
        to: user.email,
        subject: "Reset your FFX ESPORTS password",
        text: `Reset your password: ${link}`,
        html: `<p>Reset your password: <a href="${link}">${link}</a></p>`
      });
    }
    res.json({ data: { ok: true }, message: "If the email exists, a reset link has been sent" });
  })
);

router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const input = z.object({ token: z.string().min(32), password: passwordSchema }).parse(req.body);
    const tokenHash = sha256(input.token);
    const reset = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });
    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      throw new ApiError(400, "Invalid or expired reset token");
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash: await hashPassword(input.password) }
      }),
      prisma.passwordResetToken.update({
        where: { id: reset.id },
        data: { usedAt: new Date() }
      }),
      prisma.refreshToken.updateMany({
        where: { userId: reset.userId, revokedAt: null },
        data: { revokedAt: new Date() }
      })
    ]);
    res.json({ data: { ok: true }, message: "Password reset complete" });
  })
);

router.post(
  "/send-otp",
  asyncHandler(async (req, res) => {
    const input = z
      .object({ email: emailSchema, purpose: z.string().default("EMAIL_VERIFY") })
      .parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    const code = generateOtp();
    await prisma.otpCode.create({
      data: {
        userId: user?.id,
        email: input.email,
        codeHash: sha256(code),
        purpose: input.purpose,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });
    await sendMail({
      to: input.email,
      subject: "Your FFX ESPORTS OTP",
      text: `Your OTP is ${code}. It expires in 10 minutes.`,
      html: `<p>Your OTP is <strong>${code}</strong>. It expires in 10 minutes.</p>`
    });
    res.json({ data: { ok: true }, message: "OTP sent" });
  })
);

router.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        email: emailSchema,
        code: z.string().length(6),
        purpose: z.string().default("EMAIL_VERIFY")
      })
      .parse(req.body);

    const otp = await prisma.otpCode.findFirst({
      where: {
        email: input.email,
        purpose: input.purpose,
        consumedAt: null
      },
      orderBy: { createdAt: "desc" }
    });
    if (!otp || otp.expiresAt < new Date()) throw new ApiError(400, "OTP expired or invalid");
    if (otp.attempts >= 5) throw new ApiError(429, "Too many OTP attempts");
    if (otp.codeHash !== sha256(input.code)) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      throw new ApiError(400, "OTP invalid");
    }

    await prisma.$transaction([
      prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } }),
      prisma.user.updateMany({
        where: { email: input.email },
        data: { emailVerified: true, status: "ACTIVE" }
      })
    ]);
    res.json({ data: { ok: true }, message: "OTP verified" });
  })
);

function oauthUnavailable(provider: string) {
  return new ApiError(503, `${provider} OAuth is not configured`);
}

router.get("/google", (_req, res, next) => {
  if (!env.GOOGLE_CLIENT_ID) return next(oauthUnavailable("Google"));
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.GOOGLE_CALLBACK_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "offline");
  res.redirect(url.toString());
});

router.get(
  "/google/callback",
  asyncHandler(async (req, res) => {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) throw oauthUnavailable("Google");
    const code = z.string().parse(req.query.code);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code"
      })
    });
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token) throw new ApiError(401, "Google OAuth failed");
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = (await profileResponse.json()) as {
      email: string;
      name: string;
      picture?: string;
      email_verified?: boolean;
    };
    const user = await upsertOAuthUser(profile.email, profile.name, profile.picture, profile.email_verified);
    const roles = await rolesForUser(user.id);
    const tokens = await issueTokens({ user, roles, ip: req.ip, userAgent: req.header("user-agent") });
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.redirect(`${env.WEB_APP_URL}/dashboard`);
  })
);

router.get("/discord", (_req, res, next) => {
  if (!env.DISCORD_CLIENT_ID) return next(oauthUnavailable("Discord"));
  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.DISCORD_CALLBACK_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify email");
  res.redirect(url.toString());
});

router.get(
  "/discord/callback",
  asyncHandler(async (req, res) => {
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) throw oauthUnavailable("Discord");
    const code = z.string().parse(req.query.code);
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        redirect_uri: env.DISCORD_CALLBACK_URL,
        grant_type: "authorization_code"
      })
    });
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token) throw new ApiError(401, "Discord OAuth failed");
    const profileResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = (await profileResponse.json()) as {
      email: string;
      username: string;
      avatar?: string;
      id: string;
      verified?: boolean;
    };
    const avatar = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      : undefined;
    const user = await upsertOAuthUser(profile.email, profile.username, avatar, profile.verified);
    const roles = await rolesForUser(user.id);
    const tokens = await issueTokens({ user, roles, ip: req.ip, userAgent: req.header("user-agent") });
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.redirect(`${env.WEB_APP_URL}/dashboard`);
  })
);

async function upsertOAuthUser(email: string, name: string, avatarUrl?: string, verified = true) {
  const usernameBase = cleanText(name).replace(/\s+/g, "").slice(0, 18) || "ffxplayer";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        avatarUrl: avatarUrl ?? existing.avatarUrl,
        emailVerified: verified || existing.emailVerified,
        status: verified ? "ACTIVE" : existing.status
      }
    });
  }

  const username = `${usernameBase}${crypto.randomInt(1000, 9999)}`.toLowerCase();
  return prisma.user.create({
    data: {
      email,
      username,
      avatarUrl,
      emailVerified: verified,
      status: verified ? "ACTIVE" : "PENDING_VERIFICATION",
      referralCode: referralCode(username),
      wallet: { create: {} },
      roles: {
        create: {
          role: {
            connectOrCreate: {
              where: { name: "USER" },
              create: { name: "USER", description: "Player account" }
            }
          }
        }
      }
    }
  });
}

export default router;
