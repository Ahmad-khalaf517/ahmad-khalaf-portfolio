interface RateLimitOptions {
  limit: number;
  windowMs: number;
  maxEntries?: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function createRateLimiter({
  limit,
  windowMs,
  maxEntries = 5000,
}: RateLimitOptions) {
  const buckets = new Map<string, RateLimitBucket>();

  function removeExpired(now: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const current = buckets.get(key);

      if (!current || current.resetAt <= now) {
        if (buckets.size >= maxEntries) {
          removeExpired(now);
        }

        if (buckets.size >= maxEntries) {
          const oldestKey = buckets.keys().next().value;
          if (oldestKey) buckets.delete(oldestKey);
        }

        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (current.count >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((current.resetAt - now) / 1000),
          ),
        };
      }

      current.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
    reset() {
      buckets.clear();
    },
  };
}
