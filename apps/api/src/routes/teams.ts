import crypto from "node:crypto";
import { Router } from "express";
import { Game } from "@prisma/client";
import { z } from "zod";
import { audit } from "../lib/audit";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { cleanText } from "../lib/validation";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { captainId: req.user!.id },
          {
            members: {
              some: {
                userId: req.user!.id,
                status: "ACTIVE"
              }
            }
          }
        ]
      },
      include: {
        captain: {
          select: {
            username: true,
            avatarUrl: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                username: true,
                avatarUrl: true
              }
            }
          }
        },
        participants: {
          include: {
            tournament: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({ data: teams });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        name: z.string().min(3).max(48).transform(cleanText),
        tag: z
          .string()
          .min(2)
          .max(6)
          .transform((value) => cleanText(value).toUpperCase()),
        game: z.nativeEnum(Game),
        logoUrl: z.string().url().optional()
      })
      .parse(req.body);

    const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    const team = await prisma.team.create({
      data: {
        name: input.name!,
        game: input.game!,
        tag: input.tag,
        logoUrl: input.logoUrl,
        inviteCode,

        captain: {
          connect: {
            id: req.user!.id
          }
        },

        members: {
          create: {
            userId: req.user!.id,
            role: "CAPTAIN",
            status: "ACTIVE"
          }
        }
      },

      include: {
        members: true
      }
    });

    await audit(req, {
      action: "CREATE_TEAM",
      resource: "Team",
      resourceId: team.id
    });

    res.status(201).json({ data: team });
  })
);

router.post(
  "/:id/invite",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        usernameOrEmail: z.string().min(3).transform(cleanText)
      })
      .parse(req.body);

    const team = await prisma.team.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!team || team.captainId !== req.user!.id) {
      throw new ApiError(403, "Only captain can invite players");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: input.usernameOrEmail
          },
          {
            email: input.usernameOrEmail.toLowerCase()
          }
        ]
      }
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const member = await prisma.teamMember.upsert({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: user.id
        }
      },

      create: {
        teamId: team.id,
        userId: user.id,
        status: "INVITED"
      },

      update: {
        status: "INVITED"
      }
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "TEAM",
        title: "Team invite",
        body: `${req.user!.username} invited you to join ${team.name}`,
        data: {
          teamId: team.id,
          memberId: member.id
        }
      }
    });

    res.status(201).json({ data: member });
  })
);

router.post(
  "/:id/members/:memberId/respond",
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        accept: z.boolean()
      })
      .parse(req.body);

    const member = await prisma.teamMember.findUnique({
      where: {
        id: req.params.memberId
      },

      include: {
        team: true
      }
    });

    if (
      !member ||
      member.teamId !== req.params.id ||
      member.userId !== req.user!.id
    ) {
      throw new ApiError(404, "Invite not found");
    }

    const updated = await prisma.teamMember.update({
      where: {
        id: member.id
      },

      data: {
        status: input.accept ? "ACTIVE" : "DECLINED"
      }
    });

    res.json({ data: updated });
  })
);

router.delete(
  "/:id/members/:memberId",
  asyncHandler(async (req, res) => {
    const team = await prisma.team.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!team || team.captainId !== req.user!.id) {
      throw new ApiError(403, "Only captain can remove members");
    }

    await prisma.teamMember.update({
      where: {
        id: req.params.memberId
      },

      data: {
        status: "REMOVED"
      }
    });

    res.json({
      data: {
        ok: true
      }
    });
  })
);

export default router;