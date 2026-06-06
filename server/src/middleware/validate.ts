import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { badRequest } from '../utils/errors';

export function validate<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.') || '_root';
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      }
      next(badRequest('Validation failed', fieldErrors));
      return;
    }

    req.validated = result.data;
    next();
  };
}
