import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { pool } from './config/db';
import { storageRoot, ensureStorageDirs } from './config/storage';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import contactRoutes from './routes/contacts';
import testimonialRoutes from './routes/testimonials';
import uploadRoutes from './routes/upload';
import adminRoutes from './routes/admin';

ensureStorageDirs();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.use('/uploads', express.static(storageRoot));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', message: 'Database unavailable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

function start(): void {
  try {
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Storage path: ${path.resolve(storageRoot)}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to start server:', message);
    process.exit(1);
  }
}

start();

export default app;
