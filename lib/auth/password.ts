import bcrypt from 'bcryptjs';

/**
 * Work factor for bcrypt. 12 is a good balance of security and latency in 2026.
 */
const SALT_ROUNDS = 12;

/** Hash a plaintext password (replaces the original's plaintext storage). */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Verify a plaintext password against a stored bcrypt hash. */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
