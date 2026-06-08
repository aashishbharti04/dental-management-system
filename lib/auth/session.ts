import { SignJWT, jwtVerify } from 'jose';
import { authSecret, sessionMaxAge } from '@/lib/env';
import type { SessionUser } from '@/lib/types';

/**
 * Edge-safe session helpers. This module deliberately avoids `next/headers` so it
 * can be imported from middleware (which runs on the Edge runtime). Cookie I/O
 * lives in `./cookies.ts`.
 */
export const SESSION_COOKIE_NAME = 'dms_session';

/** Sign a session token for the given user. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAge()}s`)
    .sign(authSecret());
}

/** Verify a token and return the user, or `null` if missing/invalid/expired. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, authSecret());
    if (!payload.sub) return null;
    return { id: Number(payload.sub), username: String(payload.username ?? '') };
  } catch {
    return null;
  }
}
