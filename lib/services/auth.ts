import type { RowDataPacket } from 'mysql2';
import { execute, query } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { ConflictError } from '@/lib/errors';
import type { SessionUser } from '@/lib/types';

interface AccountRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

interface CountRow extends RowDataPacket {
  count: number;
}

/** Total number of registered accounts (used to gate first-admin bootstrap). */
export async function countUsers(): Promise<number> {
  const rows = await query<CountRow[]>('SELECT COUNT(*) AS count FROM accounts');
  return rows[0]?.count ?? 0;
}

async function findAccountByUsername(username: string): Promise<AccountRow | null> {
  const rows = await query<AccountRow[]>(
    'SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1',
    [username],
  );
  return rows[0] ?? null;
}

/**
 * Validate a username/password pair. Returns the user on success, or `null` on
 * any failure (unknown user or wrong password) — without revealing which.
 */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<SessionUser | null> {
  const account = await findAccountByUsername(username);
  // Note: a small timing difference remains between known/unknown users. For a
  // self-hosted admin tool this is an acceptable trade-off.
  if (!account) return null;

  const ok = await verifyPassword(password, account.password_hash);
  if (!ok) return null;

  return { id: account.id, username: account.username };
}

/** Create a new account with a bcrypt-hashed password. */
export async function createAccount(username: string, password: string): Promise<SessionUser> {
  if (await findAccountByUsername(username)) {
    throw new ConflictError('That username is already taken.');
  }
  const passwordHash = await hashPassword(password);
  const result = await execute('INSERT INTO accounts (username, password_hash) VALUES (?, ?)', [
    username,
    passwordHash,
  ]);
  return { id: result.insertId, username };
}
