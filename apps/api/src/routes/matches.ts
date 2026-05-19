import multer from "multer";
import { Router } from "express";
import { z } from "zod";
import { scoreBattleRoyale } from "@ffx/utils";
import { audit } from "../lib/audit";
import { ApiError, asyncHandler } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { emitRealtime } from "../lib/realtime";
import { uploadBuffer } from "../lib/storage";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const matches = await prisma.match.findMany({
      where: {
        tournament: {
          participants: {
            some: {
              OR: [
                { userId: req.user!.id },
                { team: { members: { some: { userId: req.user!.id, status: "ACTIVE" } } } }
              ]
            }
          }
        }
      },
      include: { tournament: true },
      orderBy: { startsAt: "asc" }
    });
    res.json({ data: matches.map(maskLockedRoom) });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: {
        tournament: {
          include: {
            participants: {
              include: {
                user: { select: { username: true, avatarUrl: true } },
                team: { include: { members: true } }
              }
            }
          }
        },
        resultSubmissions: {
          include: {
            submittedBy: { select: { username: true, avatarUrl: true } },
            participant: true
          }
        }
      }
    });
    if (!match) throw new ApiError(404, "Match not found");
    const allowed = match.tournament.participants.some(
      (participant) =>
        participant.userId === req.user!.id ||
        participant.team?.members.some((member) => member.userId === req.user!.id && member.status === "ACTIVE")
    );
    if (!allowed) throw new ApiError(403, "You are not registered for this match");
    res.json({ data: maskLockedRoom(match) });
  })
);

router.post(
  "/:id/submit-result",
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "proof", maxCount: 1 }
  ]),
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        kills: z.coerce.number().int().min(0).max(100),
        placement: z.coerce.number().int().min(1).max(100)
      })
      .parse(req.body);
    const files = req.files as Record<string, Express.Multer.File[]>;
    const screenshot = files?.screenshot?.[0];
    const proof = files?.proof?.[0];
    if (!screenshot) throw new ApiError(422, "Result screenshot is required");

    const match = await prisma.match.findUnique({ where: { id: req.params.id } });
    if (!match) throw new ApiError(404, "Match not found");
    if (!["LIVE", "RESULT_PENDING", "COMPLETED"].includes(match.status)) {
      throw new ApiError(409, "Result submission is not open");
    }
    const participant = await prisma.participant.findFirst({
      where: {
        tournamentId: match.tournamentId,
        OR: [
          { userId: req.user!.id },
          { team: { members: { some: { userId: req.user!.id, status: "ACTIVE" } } } }
        ]
      }
    });
    if (!participant) throw new ApiError(403, "Participant not found for this match");

    const [screenshotUrl, proofUrl] = await Promise.all([
      uploadBuffer({
        buffer: screenshot.buffer,
        mimeType: screenshot.mimetype,
        folder: "match-results",
        filename: screenshot.originalname
      }),
      proof
        ? uploadBuffer({
            buffer: proof.buffer,
            mimeType: proof.mimetype,
            folder: "match-results",
            filename: proof.originalname
          })
        : Promise.resolve(undefined)
    ]);

    const result = await prisma.resultSubmission.create({
      data: {
        matchId: match.id,
        participantId: participant.id,
        submittedById: req.user!.id,
        kills: input.kills,
        placement: input.placement,
        score: scoreBattleRoyale(input.kills, input.placement),
        screenshotUrl,
        proofUrl
      }
    });
    await prisma.match.update({
      where: { id: match.id },
      data: { status: "RESULT_PENDING" }
    });
    await audit(req, { action: "SUBMIT_RESULT", resource: "Match", resourceId: match.id });
    emitRealtime("match:result-submitted", { matchId: match.id, resultId: result.id });
    res.status(201).json({ data: result });
  })
);

function maskLockedRoom<T extends { roomUnlockAt: Date | null; status: string; roomId: string | null; roomPassword: string | null }>(
  match: T
) {
  const unlocked =
    match.status === "ROOM_RELEASED" || match.status === "LIVE" || (match.roomUnlockAt && match.roomUnlockAt <= new Date());
  if (unlocked) return match;
  return { ...match, roomId: null, roomPassword: null };
}

export default router;
