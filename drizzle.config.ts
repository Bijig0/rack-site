import { defineConfig } from 'drizzle-kit';
import path from 'path';

export default defineConfig({
  schema: path.resolve(__dirname, './src/db/schema.ts'),
  out: path.resolve(__dirname, './drizzle'),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway',
  },
});
