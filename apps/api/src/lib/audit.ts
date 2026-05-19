import type { Request } from "express";
import { prisma } from "./prisma";

export async function audit(req: Request, input: {
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      ip: req.ip,
      metadata: input.metadata as object
    }
  });
}

export async function adminLog(req: Request, input: {
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: unknown;
}) {
  await prisma.adminLog.create({
    data: {
      actorId: req.user?.id,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata as object
    }
  });
}
