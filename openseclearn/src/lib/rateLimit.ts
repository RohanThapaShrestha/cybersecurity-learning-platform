// Simple in-memory per-IP rate limiter for login endpoint
// Max 5 failed attempts per 15 minutes

interface AttemptRecord {
  count: number;
  firstAttempt: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, AttemptRecord>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export function resetRateLimit(ip: string): void {
  attempts.delete(ip);
}

// Cleanup stale entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of attempts.entries()) {
    if (now - record.firstAttempt > WINDOW_MS) {
      attempts.delete(ip);
    }
  }
}, 30 * 60 * 1000);
