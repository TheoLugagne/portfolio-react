import { Router } from 'express';
import { pool } from '../config/db';
import { validate } from '../middleware/validate';
import { authGuard } from '../middleware/authGuard';
import { googleAuthSchema, type GoogleAuthInput } from '../schemas';
import { verifyGoogleCredential } from '../services/googleAuth';
import { signToken } from '../services/jwtService';
import { mapUser } from '../utils/mappers';
import type { UserRow } from '../types/db';

const router = Router();

router.post('/google', validate(googleAuthSchema), async (req, res, next) => {
  try {
    const { credential } = req.validated as GoogleAuthInput;
    const googleUser = await verifyGoogleCredential(credential);

    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (google_id, email, name, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (google_id) DO UPDATE SET
         email = EXCLUDED.email,
         name = EXCLUDED.name,
         avatar_url = EXCLUDED.avatar_url
       RETURNING id, email, name, avatar_url`,
      [googleUser.googleId, googleUser.email, googleUser.name, googleUser.avatarUrl]
    );

    const user = mapUser(rows[0]);
    const token = signToken(user);

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authGuard, (req, res) => {
  res.json({ user: req.user });
});

export default router;
