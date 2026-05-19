import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type AppRequest = Request & {
  params: Record<string, string>;
};

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function asyncHandler<T extends Request>(
  handler: (req: T & AppRequest, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req as T & AppRequest, res, next)).catch(next);
  };
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Validation failed",
      details: error.flatten()
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : message
  });
}
