// Token-bucket rate limiter, in-memory.
interface Bucket {
  count: number;
  resetAt: number;
}

const BUCKETS = new Map<string, Bucket>();

export interface RateLimitOpts {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}

export function checkRateLimit(key: string, opts: RateLimitOpts): RateLimitResult {
  const now = Date.now();
  const existing = BUCKETS.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + opts.windowMs;
    BUCKETS.set(key, { count: 1, resetAt });
    return { ok: true, remaining: opts.max - 1, resetAt, retryAfter: 0 };
  }
  if (existing.count >= opts.max) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000)
    };
  }
  existing.count += 1;
  return {
    ok: true,
    remaining: opts.max - existing.count,
    resetAt: existing.resetAt,
    retryAfter: 0
  };
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of BUCKETS.entries()) {
      if (b.resetAt <= now) BUCKETS.delete(k);
    }
  }, 60_000).unref?.();
}
