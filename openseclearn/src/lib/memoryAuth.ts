/**
 * In-memory user store — works without PostgreSQL.
 * When the database is available, the DB takes priority.
 * Pre-seeded with default development accounts.
 */

import bcrypt from 'bcryptjs';
/** Simple UUID v4 fallback */
function v4Fallback(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: string;
  completion_percentage: number;
  last_activity: string | null;
}

// Pre-hash default dev passwords at module load (change in production)
const ADMIN_HASH = bcrypt.hashSync('admin', 10);
const USER_HASH = bcrypt.hashSync('user', 10);

const users: Map<string, MemoryUser> = new Map();

// Seed default accounts
const adminId = 'a0000000-0000-0000-0000-000000000001';
const userId = 'u0000000-0000-0000-0000-000000000002';

users.set(adminId, {
  id: adminId,
  name: 'Admin',
  email: 'admin',
  password_hash: ADMIN_HASH,
  role: 'admin',
  created_at: new Date().toISOString(),
  completion_percentage: 0,
  last_activity: null,
});

users.set(userId, {
  id: userId,
  name: 'Demo User',
  email: 'user',
  password_hash: USER_HASH,
  role: 'user',
  created_at: new Date().toISOString(),
  completion_percentage: 0,
  last_activity: null,
});

// In-memory progress store
interface MemoryProgress {
  completed_lessons: string[];
  completed_homework: string[];
  current_stage: string;
  completion_percentage: number;
  last_activity: string | null;
}

const progressStore: Map<string, MemoryProgress> = new Map();

// In-memory homework submissions
interface MemorySubmission {
  id: string;
  user_id: string;
  homework_id: string;
  answer_text: string;
  status: string;
  submitted_at: string;
}

const submissionStore: Map<string, MemorySubmission> = new Map();

// ── User operations ─────────────────────────────────────────

export function findUserByEmail(email: string): MemoryUser | undefined {
  for (const u of users.values()) {
    if (u.email === email) return u;
  }
  return undefined;
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createUser(name: string, email: string, passwordHash: string): MemoryUser {
  const id = v4Fallback();
  const newUser: MemoryUser = {
    id,
    name,
    email,
    password_hash: passwordHash,
    role: 'user',
    created_at: new Date().toISOString(),
    completion_percentage: 0,
    last_activity: null,
  };
  users.set(id, newUser);
  return newUser;
}

export function getAllUsers(): MemoryUser[] {
  return Array.from(users.values());
}

export function deleteUser(userId: string): boolean {
  return users.delete(userId);
}

export function getUserById(id: string): MemoryUser | undefined {
  return users.get(id);
}

/** Update the password hash for a user identified by email */
export function updateUserPassword(email: string, newPasswordHash: string): boolean {
  for (const u of users.values()) {
    if (u.email === email.toLowerCase()) {
      u.password_hash = newPasswordHash;
      return true;
    }
  }
  return false;
}

// ── Progress operations ─────────────────────────────────────

export function getProgress(uid: string): MemoryProgress {
  if (!progressStore.has(uid)) {
    progressStore.set(uid, {
      completed_lessons: [],
      completed_homework: [],
      current_stage: 'fundamentals',
      completion_percentage: 0,
      last_activity: null,
    });
  }
  return progressStore.get(uid)!;
}

export function updateProgressHomework(uid: string, homeworkId: string): MemoryProgress {
  const p = getProgress(uid);
  if (!p.completed_homework.includes(homeworkId)) {
    p.completed_homework.push(homeworkId);
    p.completion_percentage = Math.round(
      ((p.completed_lessons.length + p.completed_homework.length) / 34) * 100 * 100
    ) / 100;
  }
  p.last_activity = new Date().toISOString();
  progressStore.set(uid, p);
  return p;
}

// ── Submission operations ───────────────────────────────────

export function submitHomework(uid: string, homeworkId: string, answerText: string): MemorySubmission {
  const key = `${uid}:${homeworkId}`;
  const sub: MemorySubmission = {
    id: v4Fallback(),
    user_id: uid,
    homework_id: homeworkId,
    answer_text: answerText,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  };
  submissionStore.set(key, sub);
  updateProgressHomework(uid, homeworkId);
  return sub;
}

// ── DB availability check ───────────────────────────────────

let dbAvailable: boolean | null = null;

export async function isDbAvailable(pool: { query: (q: string) => Promise<unknown> }): Promise<boolean> {
  if (dbAvailable !== null) return dbAvailable;
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
  } catch {
    dbAvailable = false;
  }
  return dbAvailable;
}

export function resetDbCheck(): void {
  dbAvailable = null;
}
