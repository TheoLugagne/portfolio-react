import type { NextFunction, Request, Response } from 'express';
import { AppError, isPgError } from '../utils/errors';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.status).json({
      message: error.message,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    });
    return;
  }

  if (isPgError(error)) {
    if (error.code === '23505') {
      res.status(409).json({ message: 'Resource already exists' });
      return;
    }
    if (error.code === '22P02') {
      res.status(400).json({ message: 'Invalid identifier format' });
      return;
    }
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
}
