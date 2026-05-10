/**
 * Simple UUID v4 fallback for in-memory IDs.
 * Uses crypto.randomUUID when available, otherwise falls back to a manual
 * implementation so we never depend on an external package.
 */
export function v4Fallback(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Manual fallback (RFC 4122 v4)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
