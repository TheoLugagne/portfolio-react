import { Pool, type PoolConfig } from 'pg';
import { env } from './env';

function buildPoolConfig(): PoolConfig {
  const config: PoolConfig = { connectionString: env.databaseUrl };

  const urlHasSsl = /sslmode=/i.test(env.databaseUrl);
  if (!urlHasSsl && env.databaseSsl === 'require') {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

export const pool = new Pool(buildPoolConfig());

pool.on('error', (error: Error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});
