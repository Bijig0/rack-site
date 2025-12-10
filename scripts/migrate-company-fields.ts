import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Adding company_name and company_logo_url columns to user table...');

  try {
    // Add company_name column
    await db.execute(sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS company_name TEXT`);
    console.log('Added company_name column');

    // Add company_logo_url column
    await db.execute(sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS company_logo_url TEXT`);
    console.log('Added company_logo_url column');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
