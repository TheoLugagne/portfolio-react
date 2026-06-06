import { Router } from 'express';
import { pool } from '../config/db';
import { authGuard } from '../middleware/authGuard';
import type { StatsRow } from '../types/db';

const router = Router();

router.get('/stats', authGuard, async (_req, res, next) => {
  try {
    const { rows } = await pool.query<StatsRow>(`
      SELECT
        (SELECT COUNT(*)::int FROM projects) AS project_count,
        (SELECT COUNT(*)::int FROM contacts WHERE read = false) AS unread_contacts,
        (SELECT COUNT(*)::int FROM testimonials WHERE visible = true) AS active_testimonials,
        (SELECT COUNT(*)::int FROM contacts) AS total_contacts
    `);

    const stats = rows[0];
    res.json({
      projectCount: stats.project_count,
      unreadContacts: stats.unread_contacts,
      activeTestimonials: stats.active_testimonials,
      totalContacts: stats.total_contacts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
