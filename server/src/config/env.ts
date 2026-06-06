import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: requireEnv('DATABASE_URL'),
  databaseSsl: process.env.DATABASE_SSL || null,
  googleClientId: requireEnv('GOOGLE_CLIENT_ID'),
  jwtSecret: requireEnv('JWT_SECRET'),
  adminEmails: (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
  storagePath: process.env.STORAGE_PATH || './uploads',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  isDev: process.env.NODE_ENV !== 'production',
};
