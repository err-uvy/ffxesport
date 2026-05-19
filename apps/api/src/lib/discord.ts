import { env } from "../config/env";

export async function sendDiscordOps(message: string, embeds?: unknown[]) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "FFX ESPORTS Ops",
      content: message,
      embeds
    })
  }).catch(() => undefined);
}
