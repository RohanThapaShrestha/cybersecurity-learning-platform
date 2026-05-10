/**
 * OTP (One-Time Password) store — in-memory with expiry.
 * Generates 6-digit numeric codes valid for 10 minutes.
 */

interface OTPEntry {
  code: string;
  expiresAt: number;
  attempts: number; // Track failed attempts to prevent brute force
}

// OTP store keyed by lowercase email
const otpStore: Map<string, OTPEntry> = new Map();

// Reset token store — issued after successful OTP verification
const resetTokenStore: Map<string, { email: string; expiresAt: number }> = new Map();

// Rate limit: max OTP requests per email
const otpRateLimit: Map<string, { count: number; resetAt: number }> = new Map();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const RESET_TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_REQUESTS = 3;

/** Generate a cryptographically random 6-digit OTP */
function generateCode(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return String(arr[0] % 1000000).padStart(6, '0');
  }
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Generate a random reset token */
function generateResetToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID() + '-' + Date.now().toString(36);
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Check if the email has exceeded OTP request rate limit.
 * @returns true if rate limited (should block), false if allowed
 */
export function isOtpRateLimited(email: string): boolean {
  const key = email.toLowerCase();
  const now = Date.now();
  const entry = otpRateLimit.get(key);

  if (!entry || now > entry.resetAt) {
    otpRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_OTP_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

/**
 * Generate and store an OTP for the given email.
 * @returns the 6-digit OTP code
 */
export function createOTP(email: string): string {
  const key = email.toLowerCase();
  const code = generateCode();

  otpStore.set(key, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });

  return code;
}

/**
 * Verify an OTP for the given email.
 * @returns { valid: true } on success, { valid: false, reason } on failure
 */
export function verifyOTP(email: string, code: string): { valid: boolean; reason?: string } {
  const key = email.toLowerCase();
  const entry = otpStore.get(key);

  if (!entry) {
    return { valid: false, reason: 'No OTP found for this email. Please request a new one.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return { valid: false, reason: 'OTP has expired. Please request a new one.' };
  }

  if (entry.attempts >= MAX_OTP_ATTEMPTS) {
    otpStore.delete(key);
    return { valid: false, reason: 'Too many failed attempts. Please request a new OTP.' };
  }

  if (entry.code !== code) {
    entry.attempts++;
    return { valid: false, reason: `Invalid OTP. ${MAX_OTP_ATTEMPTS - entry.attempts} attempts remaining.` };
  }

  // Success — delete OTP and issue a reset token
  otpStore.delete(key);
  return { valid: true };
}

/**
 * Create a reset token after successful OTP verification.
 * @returns the reset token string
 */
export function createResetToken(email: string): string {
  const token = generateResetToken();
  resetTokenStore.set(token, {
    email: email.toLowerCase(),
    expiresAt: Date.now() + RESET_TOKEN_EXPIRY_MS,
  });
  return token;
}

/**
 * Verify and consume a reset token.
 * @returns the associated email if valid, null otherwise
 */
export function verifyResetToken(token: string): string | null {
  const entry = resetTokenStore.get(token);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    resetTokenStore.delete(token);
    return null;
  }

  // Consume the token (one-time use)
  resetTokenStore.delete(token);
  return entry.email;
}

// Cleanup expired entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of otpStore) {
      if (now > entry.expiresAt) otpStore.delete(key);
    }
    for (const [key, entry] of resetTokenStore) {
      if (now > entry.expiresAt) resetTokenStore.delete(key);
    }
    for (const [key, entry] of otpRateLimit) {
      if (now > entry.resetAt) otpRateLimit.delete(key);
    }
  }, 5 * 60 * 1000);
}
