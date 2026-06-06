import type { NextFunction, Request, Response } from 'express';
import { pool } from '../config/db';
import { verifyToken } from '../services/jwtService';
import { mapUser } from '../utils/mappers';
import { unauthorized } from '../utils/errors';
import type { UserRow } from '../types/db';

export async function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw unauthorized('Missing authorization token');
    }

    const token = header.slice(7);
    const payload = verifyToken(token);

    const { rows } = await pool.query<UserRow>(
      'SELECT id, email, name, avatar_url FROM users WHERE id = $1',
      [payload.sub]
    );

    if (rows.length === 0) {
      throw unauthorized('User not found');
    }

    req.user = mapUser(rows[0]);
    next();
  } catch (error) {
    next(error);
  }
}
