import crypto from "node:crypto";
import cookieParser from "cookie-parser";
import cors from "cors";
import type {
  Express,
  NextFunction,
  Request,
  Response
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import {
  env,
  isProduction
} from "../config/env";
import { ApiError } from "../lib/errors";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ffxesport-web.vercel.app"
];

const csrfExempt = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
  "/api/payments/razorpay/webhook",
  "/api/payments/cashfree/webhook"
];

export function configureSecurity(
  app: Express
) {

  app.set("trust proxy", 1);

  // HELMET
  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );

  // CORS
  app.use(
    cors({
      origin(origin, callback) {

        // allow mobile apps/postman/server requests
        if (!origin) {
          return callback(null, true);
        }

        if (
          allowedOrigins.includes(origin)
        ) {
          return callback(null, true);
        }

        return callback(
          new Error(
            `CORS blocked origin ${origin}`
          )
        );
      },

      credentials: true,

      methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
      ],

      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-csrf-token",
        "x-device-fingerprint"
      ]
    })
  );

  // COOKIES
  app.use(
    cookieParser(
      env.COOKIE_SECRET
    )
  );

  // RATE LIMIT
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 180,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  // LOGGER
  app.use(
    morgan(
      isProduction
        ? "combined"
        : "dev"
    )
  );

  // CSRF
  app.use(csrfProtection);
}

function safeEqual(
  a: string,
  b: string
) {
  const aBuffer =
    Buffer.from(a);

  const bBuffer =
    Buffer.from(b);

  return (
    aBuffer.length ===
      bBuffer.length &&
    crypto.timingSafeEqual(
      aBuffer,
      bBuffer
    )
  );
}

function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction
) {

  let token =
    req.cookies
      ?.ffx_csrf as
      | string
      | undefined;

  // CREATE TOKEN
  if (!token) {

    token = crypto
      .randomBytes(32)
      .toString("hex");

      res.cookie(
  "ffx_csrf",
  token,
  {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction
      ? "none"
      : "lax",
    path: "/"
  }
);
  }

  // SAFE METHODS
  if (
    [
      "GET",
      "HEAD",
      "OPTIONS"
    ].includes(req.method)
  ) {
    return next();
  }

  // EXEMPT ROUTES
  if (
    csrfExempt.some((path) =>
      req.path.startsWith(path)
    )
  ) {
    return next();
  }

  // VERIFY TOKEN
  const header =
    req.header(
      "x-csrf-token"
    );

  if (
    !header ||
    !safeEqual(
      header,
      token
    )
  ) {
    return next(
      new ApiError(
        403,
        "Invalid CSRF token"
      )
    );
  }

  return next();
}