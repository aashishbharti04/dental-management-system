import type { NextRequest } from 'next/server';
import { requireSessionUser } from '@/lib/auth/cookies';
import { createStaff, listStaff } from '@/lib/services/staff';
import { staffSchema } from '@/lib/validation/schemas';
import { handleApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireSessionUser();
    const q = req.nextUrl.searchParams.get('q') ?? undefined;
    const staff = await listStaff(q);
    return jsonOk({ staff });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSessionUser();
    const body = await req.json().catch(() => null);
    const parsed = staffSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Validation failed', 422, parsed.error.flatten().fieldErrors);
    }
    const staff = await createStaff(parsed.data);
    return jsonOk({ staff }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
