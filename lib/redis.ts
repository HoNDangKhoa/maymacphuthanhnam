import { Redis } from "@upstash/redis";

/**
 * Upstash Redis — chuẩn trên Vercel (HTTP REST, không cần TCP persistent).
 * Local: tạo free DB tại https://console.upstash.com rồi dán URL/TOKEN vào .env
 */
const globalForRedis = globalThis as unknown as { redis?: Redis | null };

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[redis] Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — cache disabled",
      );
    }
    return null;
  }

  return new Redis({ url, token });
}

export const redis = globalForRedis.redis ?? createRedis();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

export function isRedisEnabled() {
  return !!redis;
}
