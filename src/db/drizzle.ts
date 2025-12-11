import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/lib/config';

// For query purposes - use single connection for serverless
const queryClient = postgres(env.DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });
