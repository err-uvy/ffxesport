import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { fingerprintRiskScore } from "../../utils/src";
export async function trackDevice(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!req.user) return next();
    const fingerprint = String(req.header("x-device-fingerprint") ?? "unknown");
    const emulatorDetected = req.header("x-emulator-detected") === "true";
    const existingUsers = await prisma.deviceLog.findMany({
      where: { fingerprint },
      distinct: ["userId"],
      select: { userId: true }
    });
    const riskScore = fingerprintRiskScore({
      emulatorDetected,
      multiAccountDeviceCount: existingUsers.length
    });

    await prisma.deviceLog.upsert({
      where: {
        userId_fingerprint: {
          userId: req.user.id,
          fingerprint
        }
      },
      create: {
        userId: req.user.id,
        fingerprint,
        ip: req.ip,
        userAgent: req.header("user-agent"),
        platform: req.header("sec-ch-ua-platform") ?? undefined,
        emulatorDetected,
        riskScore
      },
      update: {
        ip: req.ip,
        userAgent: req.header("user-agent"),
        emulatorDetected,
        riskScore,
        lastSeenAt: new Date()
      }
    });

    if (riskScore >= 65) {
      await prisma.fraudLog.create({
        data: {
          userId: req.user.id,
          severity: riskScore >= 90 ? "CRITICAL" : "HIGH",
          reason: "Suspicious device fingerprint activity",
          metadata: { fingerprint, existingUsers: existingUsers.length, emulatorDetected, riskScore }
        }
      });
    }
    return next();
  } catch {
    return next();
  }
}
