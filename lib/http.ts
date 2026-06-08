import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '@/lib/errors';

/** Standard success envelope: `{ data: ... }`. */
export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

/** Standard error envelope: `{ error: { message, details? } }`. */
export function jsonError(message: string, status = 400, details?: unknown): NextResponse {
  return NextResponse.json({ error: { message, details } }, { status });
}

/**
 * Translate any thrown value into a safe HTTP response. Validation and known
 * application errors map to their status; everything else becomes a generic 500
 * (the real error is logged server-side only, never leaked to the client).
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return jsonError('Validation failed', 422, error.flatten().fieldErrors);
  }
  if (error instanceof AppError) {
    return jsonError(error.message, error.status);
  }
  console.error('[api] Unhandled error:', error);
  return jsonError('Something went wrong. Please try again.', 500);
}

/** Parse a route param into a positive integer id, or `null` if invalid. */
export function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
