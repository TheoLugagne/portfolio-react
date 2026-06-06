import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

interface MigrationRow {
  name: string;
}

async function migrate(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const { rows: applied } = await client.query<MigrationRow>(
      'SELECT name FROM schema_migrations ORDER BY id'
    );
    const appliedSet = new Set(applied.map((row) => row.name));

    const baseSchema = path.join(__dirname, 'schema.sql');
    if (!appliedSet.has('000_schema.sql')) {
      const sql = fs.readFileSync(baseSchema, 'utf8');
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (name) VALUES ('000_schema.sql')"
      );
      await client.query('COMMIT');
      console.log('Applied migration: 000_schema.sql');
    }

    if (fs.existsSync(migrationsDir)) {
      const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort();

      for (const file of files) {
        if (appliedSet.has(file)) continue;

        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [
          file,
        ]);
        await client.query('COMMIT');
        console.log(`Applied migration: ${file}`);
      }
    }

    console.log('Migrations complete.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Migration failed:', message);
  process.exit(1);
});
