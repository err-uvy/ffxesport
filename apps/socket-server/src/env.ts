import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SOCKET_PORT: z.coerce.number().default(4100),
  JWT_ACCESS_SECRET: z.string().min(16).default("dev-access-secret-change-before-production"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:3000,http://localhost:3001")
});

export const env = schema.parse(process.env);
export const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
