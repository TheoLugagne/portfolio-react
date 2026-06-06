import { Router } from 'express';
import { pool } from '../config/db';
import { validate } from '../middleware/validate';
import { authGuard } from '../middleware/authGuard';
import { contactSchema, type ContactInput } from '../schemas';
import { mapContact } from '../utils/mappers';
import { notFound } from '../utils/errors';
import type { ContactRow } from '../types/db';

const router = Router();

router.post('/', validate(contactSchema), async (req, res, next) => {
  try {
    const data = req.validated as ContactInput;
    const { rows } = await pool.query<ContactRow>(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.email, data.subject, data.message]
    );

    res.status(201).json(mapContact(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.get('/', authGuard, async (_req, res, next) => {
  try {
    const { rows } = await pool.query<ContactRow>(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(rows.map(mapContact));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/read', authGuard, async (req, res, next) => {
  try {
    const { rows } = await pool.query<ContactRow>(
      `UPDATE contacts SET read = true
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (rows.length === 0) {
      throw notFound('Contact not found');
    }

    res.json(mapContact(rows[0]));
  } catch (error) {
    next(error);
  }
});

export default router;
