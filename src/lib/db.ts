import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import { env } from '@/lib/config';

// Connection pool optimized for serverless
const queryClient = postgres(env.DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });
