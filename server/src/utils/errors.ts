export class AppError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function notFound(message = 'Resource not found'): AppError {
  return new AppError(404, message);
}

export function unauthorized(message = 'Unauthorized'): AppError {
  return new AppError(401, message);
}

export function forbidden(message = 'Forbidden'): AppError {
  return new AppError(403, message);
}

export function badRequest(
  message: string,
  fieldErrors?: Record<string, string[]>
): AppError {
  return new AppError(400, message, fieldErrors);
}

export function isPgError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}
