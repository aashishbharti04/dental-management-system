import type { NextRequest } from 'next/server';
import { requireSessionUser } from '@/lib/auth/cookies';
import { deleteStaff } from '@/lib/services/staff';
import { handleApiError, jsonError, jsonOk, parseId } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSessionUser();
    const id = parseId(params.id);
    if (id === null) return jsonError('Invalid staff id', 400);
    const deleted = await deleteStaff(id);
    if (!deleted) return jsonError('Staff member not found', 404);
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
