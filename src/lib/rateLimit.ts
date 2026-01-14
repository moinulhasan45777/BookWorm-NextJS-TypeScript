import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const CLEANUP_INTERVAL = 60000;
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, CLEANUP_INTERVAL);

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max } = options;

  return (req: NextRequest): NextResponse | null => {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return null;
    }

    store[key].count++;

    if (store[key].count > max) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests, please try again later",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": max.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(store[key].resetTime).toISOString(),
          },
        }
      );
    }

    return null;
  };
}

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
