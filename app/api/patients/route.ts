import type { NextRequest } from 'next/server';
import { requireSessionUser } from '@/lib/auth/cookies';
import { createPatient, listPatients } from '@/lib/services/patients';
import { patientSchema } from '@/lib/validation/schemas';
import { handleApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireSessionUser();
    const q = req.nextUrl.searchParams.get('q') ?? undefined;
    const patients = await listPatients(q);
    return jsonOk({ patients });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSessionUser();
    const body = await req.json().catch(() => null);
    const parsed = patientSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError('Validation failed', 422, parsed.error.flatten().fieldErrors);
    }
    const patient = await createPatient(parsed.data);
    return jsonOk({ patient }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
