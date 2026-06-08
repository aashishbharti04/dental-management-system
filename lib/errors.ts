/**
 * Typed application errors. Each carries an HTTP status so the API layer can
 * translate it into the right response without leaking internals.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Invalid input',
    public readonly details?: unknown,
  ) {
    super(message, 422);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'You must be signed in to do that.') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'That resource already exists.') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many attempts. Please try again shortly.') {
    super(message, 429);
  }
}
