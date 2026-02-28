/**
 * Run full schema + migrations against the database specified in env.
 * Use this to set up your Render (or other) PostgreSQL database.
 *
 * Required env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT (or set on your machine)
 *
 * From Blog-City-Server: node scripts/run-schema-remote.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const knex = require('knex');

const dbHost = process.env.DB_HOST || '';
const needsSSL = process.env.DB_SSL === 'true' || /\.(render\.com|neon\.tech|supabase\.co|amazonaws\.com)/i.test(dbHost);

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    ssl: needsSSL ? { rejectUnauthorized: false } : false
  }
});

const sqlDir = path.join(__dirname, '..');
const files = [
  'database-setup-complete.sql',
  'database-follows-migration.sql',
  'database-multiple-categories-migration.sql',
  'database-user-preferences-migration.sql',
  'database-reports-migration.sql'
];

async function run() {
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) {
    console.error('Missing required env:', missing.join(', '));
    console.error('Set them in .env (in Blog-City-Server) or your environment, then run again.');
    process.exit(1);
  }

  console.log('Running schema and migrations against:', process.env.DB_HOST, '/', process.env.DB_NAME);

  for (const file of files) {
    const filePath = path.join(sqlDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn('Skip (not found):', file);
      continue;
    }
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log('Running:', file);
    try {
      await db.raw(sql);
      console.log('  OK');
    } catch (err) {
      console.error('  Error:', err.message);
      throw err;
    }
  }

  console.log('Done. Database is ready.');
  await db.destroy();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
