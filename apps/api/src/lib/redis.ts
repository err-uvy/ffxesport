import Redis from "ioredis";
import { env } from "../config/env";

let redis: Redis | null = null;

export function getRedis() {
  if (!env.REDIS_URL) return null;
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 2
    });
  }
  return redis;
}

export async function cacheJson<T>(key: string, ttlSeconds: number, resolver: () => Promise<T>) {
  const client = getRedis();
  if (!client) return resolver();
  if (client.status === "end" || client.status === "close") return resolver();
  if (client.status === "wait") await client.connect().catch(() => undefined);
  const cached = await client.get(key).catch(() => null);
  if (cached) return JSON.parse(cached) as T;
  const value = await resolver();
  await client.set(key, JSON.stringify(value), "EX", ttlSeconds).catch(() => undefined);
  return value;
}

export async function invalidateCache(pattern: string) {
  const client = getRedis();
  if (!client) return;
  if (client.status === "wait") await client.connect().catch(() => undefined);
  const stream = client.scanStream({ match: pattern });
  stream.on("data", (keys: string[]) => {
    if (keys.length) client.del(keys).catch(() => undefined);
  });
}
