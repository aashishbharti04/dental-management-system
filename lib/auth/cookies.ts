import { cookies } from 'next/headers';
import { sessionMaxAge } from '@/lib/env';
import { UnauthorizedError } from '@/lib/errors';
import type { SessionUser } from '@/lib/types';
import { SESSION_COOKIE_NAME, createSessionToken, verifySessionToken } from './session';

/**
 * Cookie-bound session helpers for use in Route Handlers and Server Components
 * (Node runtime only — these use `next/headers`).
 */

/** Create a signed session and store it in a hardened cookie. */
export async function startSession(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionMaxAge(),
  });
}

/** Read and verify the current session, if any. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** Like {@link getSessionUser} but throws `UnauthorizedError` when signed out. */
export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

/** Clear the session cookie (sign out). */
export function endSession(): void {
  cookies().set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
