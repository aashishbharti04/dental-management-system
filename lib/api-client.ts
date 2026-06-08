/**
 * Tiny typed fetch wrapper for client components. Unwraps the `{ data }` / `{ error }`
 * envelope used by the API and throws a useful Error (with field details) on failure.
 */
export interface ApiFieldErrors {
  [field: string]: string[] | undefined;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: ApiFieldErrors,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const json = (await res.json().catch(() => null)) as {
    data?: T;
    error?: { message?: string; details?: ApiFieldErrors };
  } | null;

  if (!res.ok) {
    throw new ApiError(
      json?.error?.message ?? 'Request failed. Please try again.',
      res.status,
      json?.error?.details,
    );
  }

  return json?.data as T;
}
