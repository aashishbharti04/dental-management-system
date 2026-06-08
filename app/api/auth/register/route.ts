import type { NextRequest } from 'next/server';
import { getSessionUser, startSession } from '@/lib/auth/cookies';
import { countUsers, createAccount } from '@/lib/services/auth';
import { registerSchema } from '@/lib/validation/schemas';
import { handleApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Whether the open "first admin" bootstrap registration is still available. */
export async function GET() {
  try {
    const userCount = await countUsers();
    return jsonOk({ bootstrap: userCount === 0 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Validation failed', 422, parsed.error.flatten().fieldErrors);
    }

    const userCount = await countUsers();
    // The first account is created openly (bootstrap). After that, only a
    // signed-in admin may add more accounts.
    if (userCount > 0) {
      const current = await getSessionUser();
      if (!current) {
        return jsonError('Registration is closed. Please sign in first.', 401);
      }
    }

    const user = await createAccount(parsed.data.username, parsed.data.password);
    if (userCount === 0) {
      await startSession(user); // Sign in the very first admin automatically.
    }
    return jsonOk({ user }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
