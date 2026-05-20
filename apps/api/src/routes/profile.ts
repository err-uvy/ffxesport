import multer from "multer";
import { Router } from "express";
import { Game } from "@prisma/client";
import { z } from "zod";

import { audit } from "../lib/audit";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { uploadBuffer } from "../lib/storage";
import { cleanText } from "../lib/validation";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get(
  "/",

  asyncHandler(async (req, res) => {
    const [user, participantCount, wins, kills] =
      await Promise.all([
        prisma.user.findUniqueOrThrow({
          where: {
            id: req.user!.id
          },

          include: {
            wallet: true,

            gameProfiles: true,

            teamMemberships: {
              include: {
                team: true
              }
            }
          }
        }),

        prisma.participant.count({
          where: {
            OR: [
              {
                userId: req.user!.id
              },

              {
                team: {
                  members: {
                    some: {
                      userId: req.user!.id
                    }
                  }
                }
              }
            ]
          }
        }),

        prisma.participant.count({
          where: {
            OR: [
              {
                userId: req.user!.id
              },

              {
                team: {
                  members: {
                    some: {
                      userId: req.user!.id
                    }
                  }
                }
              }
            ],

            placement: 1
          }
        }),

        prisma.participant.aggregate({
          where: {
            OR: [
              {
                userId: req.user!.id
              },

              {
                team: {
                  members: {
                    some: {
                      userId: req.user!.id
                    }
                  }
                }
              }
            ]
          },

          _sum: {
            kills: true,
            score: true
          }
        })
      ]);

    const achievements = [
      participantCount >= 1
        ? "Tournament Debut"
        : null,

      wins >= 1
        ? "Champion Finish"
        : null,

      (kills._sum.kills ?? 0) >= 25
        ? "Eliminator"
        : null,

      Number(user.wallet?.winningBalance ?? 0) > 0
        ? "Prize Earner"
        : null,

      user.emailVerified
        ? "Verified Player"
        : null
    ].filter(Boolean);

    res.json({
      data: {
        user,

        stats: {
          tournamentsPlayed: participantCount,

          wins,

          kills: kills._sum.kills ?? 0,

          score: kills._sum.score ?? 0,

          kdRatio: participantCount
            ? (
                (kills._sum.kills ?? 0) /
                participantCount
              ).toFixed(2)
            : "0.00"
        },

        achievements
      }
    });
  })
);

router.patch(
  "/",

  asyncHandler(async (req, res) => {
    const input = z
      .object({
        username: z
          .string()
          .min(3)
          .max(24)
          .transform(cleanText)
          .optional(),

        bio: z
          .string()
          .max(500)
          .transform(cleanText)
          .optional(),

        phone: z
          .string()
          .max(20)
          .optional()
      })

      .parse(req.body);

    const data = input as any;

    const user = await prisma.user.update({
      where: {
        id: req.user!.id
      },

      data: {
        username: data.username as string,
        bio: data.bio as string,
        phone: data.phone as string
      }
    });

    await audit(req, {
      action: "UPDATE_PROFILE",
      resource: "User",
      resourceId: user.id,
      metadata: data
    });

    res.json({
      data: user
    });
  })
);

router.post(
  "/avatar",

  upload.single("avatar"),

  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(
        422,
        "Avatar file is required"
      );
    }

    const avatarUrl = await uploadBuffer({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      folder: "avatars",
      filename: req.file.originalname
    });

    const user = await prisma.user.update({
      where: {
        id: req.user!.id
      },

      data: {
        avatarUrl
      }
    });

    await audit(req, {
      action: "UPLOAD_AVATAR",
      resource: "User",
      resourceId: user.id
    });

    res.json({
      data: {
        avatarUrl
      }
    });
  })
);

router.post(
  "/game-profiles",

  asyncHandler(async (req, res) => {
    const input = z
      .object({
        game: z.nativeEnum(Game),

        uid: z
          .string()
          .min(3)
          .max(64)
          .transform(cleanText),

        handle: z
          .string()
          .max(48)
          .transform(cleanText)
          .optional(),

        kdRatio: z.coerce
          .number()
          .min(0)
          .max(100)
          .default(0)
      })

      .parse(req.body);

    const data = input as any;

    const duplicate =
      await prisma.gameProfile.findUnique({
        where: {
          game_uid: {
            game: data.game as Game,
            uid: data.uid as string
          }
        }
      });

    if (
      duplicate &&
      duplicate.userId !== req.user!.id
    ) {
      await prisma.fraudLog.create({
        data: {
          userId: req.user!.id,

          severity: "HIGH",

          reason:
            "Duplicate gaming UID registration attempt",

          metadata: data
        }
      });

      throw new ApiError(
        409,
        "This gaming UID is already linked to another account"
      );
    }

    const profile =
      await prisma.gameProfile.upsert({
        where: {
          userId_game: {
            userId: req.user!.id,
            game: data.game as Game
          }
        },

        create: {
          game: data.game as Game,

          uid: data.uid as string,

          handle: data.handle as string,

          kdRatio: data.kdRatio as number,

          user: {
            connect: {
              id: req.user!.id
            }
          }
        },

        update: {
          uid: data.uid as string,

          handle: data.handle as string,

          kdRatio: data.kdRatio as number
        }
      });

    res.status(201).json({
      data: profile
    });
  })
);

export default router;