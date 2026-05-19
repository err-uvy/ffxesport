import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECRET: z.string().min(16).default("dev-cookie-secret-change-before-production"),
  JWT_ACCESS_SECRET: z.string().min(16).default("dev-access-secret-change-before-production"),
  JWT_REFRESH_SECRET: z.string().min(16).default("dev-refresh-secret-change-before-production"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(30),
  WEB_APP_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_APP_URL: z.string().url().default("http://localhost:3001"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().default("http://localhost:4000/api/auth/google/callback"),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  DISCORD_CALLBACK_URL: z.string().url().default("http://localhost:4000/api/auth/discord/callback"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("FFX ESPORTS <no-reply@ffxesports.com>"),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  CASHFREE_APP_ID: z.string().optional(),
  CASHFREE_SECRET_KEY: z.string().optional(),
  CASHFREE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  CASHFREE_WEBHOOK_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  DISCORD_WEBHOOK_URL: z.string().optional(),
  SOCKET_PORT: z.coerce.number().default(4100)
});

export const env = schema.parse(process.env);

export const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

export const isProduction = env.NODE_ENV === "production";
