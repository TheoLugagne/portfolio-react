import { Router } from 'express';
import { pool } from '../config/db';
import { validate } from '../middleware/validate';
import { authGuard } from '../middleware/authGuard';
import {
  testimonialCreateSchema,
  testimonialUpdateSchema,
  type TestimonialCreateInput,
  type TestimonialUpdateInput,
} from '../schemas';
import { mapTestimonial } from '../utils/mappers';
import { notFound } from '../utils/errors';
import type { TestimonialRow } from '../types/db';

const router = Router();

const columnMap: Record<keyof TestimonialUpdateInput, keyof TestimonialRow> = {
  author: 'author',
  role: 'role',
  content: 'content',
  avatarPath: 'avatar_path',
  visible: 'visible',
};

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query<TestimonialRow>(
      `SELECT * FROM testimonials
       WHERE visible = true
       ORDER BY created_at DESC`
    );
    res.json(rows.map(mapTestimonial));
  } catch (error) {
    next(error);
  }
});

router.get('/admin/all', authGuard, async (_req, res, next) => {
  try {
    const { rows } = await pool.query<TestimonialRow>(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );
    res.json(rows.map(mapTestimonial));
  } catch (error) {
    next(error);
  }
});

router.post('/', authGuard, validate(testimonialCreateSchema), async (req, res, next) => {
  try {
    const data = req.validated as TestimonialCreateInput;
    const { rows } = await pool.query<TestimonialRow>(
      `INSERT INTO testimonials (author, role, content, avatar_path, visible)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.author,
        data.role,
        data.content,
        data.avatarPath ?? null,
        data.visible,
      ]
    );

    res.status(201).json(mapTestimonial(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authGuard, validate(testimonialUpdateSchema), async (req, res, next) => {
  try {
    const data = req.validated as TestimonialUpdateInput;
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    for (const key of Object.keys(columnMap) as (keyof TestimonialUpdateInput)[]) {
      if (data[key] !== undefined) {
        fields.push(`${columnMap[key]} = $${index}`);
        values.push(data[key]);
        index += 1;
      }
    }

    if (fields.length === 0) {
      const { rows } = await pool.query<TestimonialRow>(
        'SELECT * FROM testimonials WHERE id = $1',
        [req.params.id]
      );
      if (rows.length === 0) throw notFound('Testimonial not found');
      res.json(mapTestimonial(rows[0]));
      return;
    }

    values.push(req.params.id);

    const { rows } = await pool.query<TestimonialRow>(
      `UPDATE testimonials SET ${fields.join(', ')}
       WHERE id = $${index}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      throw notFound('Testimonial not found');
    }

    res.json(mapTestimonial(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authGuard, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM testimonials WHERE id = $1',
      [req.params.id]
    );

    if (rowCount === 0) {
      throw notFound('Testimonial not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
