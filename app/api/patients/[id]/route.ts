import type { NextRequest } from 'next/server';
import { requireSessionUser } from '@/lib/auth/cookies';
import { deletePatient, getPatient } from '@/lib/services/patients';
import { handleApiError, jsonError, jsonOk, parseId } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSessionUser();
    const id = parseId(params.id);
    if (id === null) return jsonError('Invalid patient id', 400);
    const patient = await getPatient(id);
    if (!patient) return jsonError('Patient not found', 404);
    return jsonOk({ patient });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireSessionUser();
    const id = parseId(params.id);
    if (id === null) return jsonError('Invalid patient id', 400);
    const deleted = await deletePatient(id);
    if (!deleted) return jsonError('Patient not found', 404);
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
