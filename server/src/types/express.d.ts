import type { User } from './api';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validated?: unknown;
    }
  }
}

export {};
