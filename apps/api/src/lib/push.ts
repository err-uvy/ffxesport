import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "./prisma";

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    if (env.NODE_ENV === "production") throw new Error("Firebase FCM is not configured");
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    {
      iss: env.FIREBASE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600
    },
    env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    { algorithm: "RS256" }
  );

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  if (!response.ok) throw new Error(`Firebase OAuth failed: ${await response.text()}`);
  const token = (await response.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = {
    token: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000
  };
  return cachedAccessToken.token;
}

export async function sendPushToUser(input: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const accessToken = await getAccessToken();
  if (!accessToken || !env.FIREBASE_PROJECT_ID) return;
  const tokens = await prisma.pushToken.findMany({
    where: { userId: input.userId },
    select: { token: true }
  });
  if (!tokens.length) return;

  await Promise.allSettled(
    tokens.map((entry) =>
      fetch(`https://fcm.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/messages:send`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          message: {
            token: entry.token,
            notification: { title: input.title, body: input.body },
            data: input.data
          }
        })
      })
    )
  );
}
