import { Router } from 'express';
import { pool } from '../config/db';
import { validate } from '../middleware/validate';
import { authGuard } from '../middleware/authGuard';
import {
  projectCreateSchema,
  projectUpdateSchema,
  type ProjectCreateInput,
  type ProjectUpdateInput,
} from '../schemas';
import { mapProject } from '../utils/mappers';
import { notFound } from '../utils/errors';
import type { ProjectRow } from '../types/db';

const router = Router();

const columnMap: Record<keyof ProjectUpdateInput, keyof ProjectRow> = {
  title: 'title',
  slug: 'slug',
  description: 'description',
  content: 'content',
  imagePath: 'image_path',
  tags: 'tags',
  demoUrl: 'demo_url',
  githubUrl: 'github_url',
  published: 'published',
};

router.get('/admin/all', authGuard, async (_req, res, next) => {
  try {
    const { rows } = await pool.query<ProjectRow>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    res.json(rows.map(mapProject));
  } catch (error) {
    next(error);
  }
});

router.get('/admin/:id', authGuard, async (req, res, next) => {
  try {
    const { rows } = await pool.query<ProjectRow>(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0) {
      throw notFound('Project not found');
    }

    res.json(mapProject(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query<ProjectRow>(
      `SELECT * FROM projects
       WHERE published = true
       ORDER BY created_at DESC`
    );
    res.json(rows.map(mapProject));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query<ProjectRow>(
      'SELECT * FROM projects WHERE id = $1 AND published = true',
      [req.params.id]
    );

    if (rows.length === 0) {
      throw notFound('Project not found');
    }

    res.json(mapProject(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.post('/', authGuard, validate(projectCreateSchema), async (req, res, next) => {
  try {
    const data = req.validated as ProjectCreateInput;
    const { rows } = await pool.query<ProjectRow>(
      `INSERT INTO projects (
        title, slug, description, content, image_path, tags,
        demo_url, github_url, published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        data.title,
        data.slug,
        data.description,
        data.content,
        data.imagePath,
        data.tags,
        data.demoUrl ?? null,
        data.githubUrl ?? null,
        data.published,
      ]
    );

    res.status(201).json(mapProject(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authGuard, validate(projectUpdateSchema), async (req, res, next) => {
  try {
    const data = req.validated as ProjectUpdateInput;
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    for (const key of Object.keys(columnMap) as (keyof ProjectUpdateInput)[]) {
      if (data[key] !== undefined) {
        fields.push(`${columnMap[key]} = $${index}`);
        values.push(data[key]);
        index += 1;
      }
    }

    if (fields.length === 0) {
      const { rows } = await pool.query<ProjectRow>(
        'SELECT * FROM projects WHERE id = $1',
        [req.params.id]
      );
      if (rows.length === 0) throw notFound('Project not found');
      res.json(mapProject(rows[0]));
      return;
    }

    fields.push('updated_at = NOW()');
    values.push(req.params.id);

    const { rows } = await pool.query<ProjectRow>(
      `UPDATE projects SET ${fields.join(', ')}
       WHERE id = $${index}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      throw notFound('Project not found');
    }

    res.json(mapProject(rows[0]));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authGuard, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM projects WHERE id = $1',
      [req.params.id]
    );

    if (rowCount === 0) {
      throw notFound('Project not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
