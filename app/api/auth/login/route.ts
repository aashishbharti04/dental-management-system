import type { NextRequest } from 'next/server';
import { startSession } from '@/lib/auth/cookies';
import { verifyCredentials } from '@/lib/services/auth';
import { loginSchema } from '@/lib/validation/schemas';
import { handleApiError, jsonError, jsonOk } from '@/lib/http';
import { clientKey, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(clientKey(req.headers, 'login'), 10, 60_000);
    if (!limit.ok) {
      return jsonError('Too many login attempts. Please wait a moment and try again.', 429);
    }

    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Validation failed', 422, parsed.error.flatten().fieldErrors);
    }

    const user = await verifyCredentials(parsed.data.username, parsed.data.password);
    if (!user) {
      return jsonError('Invalid username or password.', 401);
    }

    await startSession(user);
    return jsonOk({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
