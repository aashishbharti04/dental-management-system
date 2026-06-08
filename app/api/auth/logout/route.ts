import { endSession } from '@/lib/auth/cookies';
import { jsonOk } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  endSession();
  return jsonOk({ ok: true });
}
