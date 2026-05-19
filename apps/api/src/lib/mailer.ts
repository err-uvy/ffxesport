import nodemailer from "nodemailer";
import { env } from "../config/env";

export async function sendMail(input: { to: string; subject: string; html: string; text: string }) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    if (env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured");
    }
    console.info(`[mail:dev] ${input.to} ${input.subject}\n${input.text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    ...input
  });
}
