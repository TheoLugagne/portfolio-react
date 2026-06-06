import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { User } from '../types/api';
import { unauthorized } from '../utils/errors';

export interface JwtPayload {
  sub: string;
  email: string;
}

export function signToken(user: User): string {
  return jwt.sign(
    { sub: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('sub' in payload) ||
      typeof payload.sub !== 'string'
    ) {
      throw unauthorized('Invalid or expired token');
    }
    return payload as JwtPayload;
  } catch {
    throw unauthorized('Invalid or expired token');
  }
}
