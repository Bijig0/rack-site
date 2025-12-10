import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from 'bcryptjs';
import { nanoid } from 'nanoid';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';

const client = postgres(connectionString);
const db = drizzle(client);

async function seedUser() {
  const email = 'bradysuryasie@gmail.com';
  const password = 'Mycariscclass1';
  const name = 'Brady Suryasie';

  const userId = nanoid();
  const accountId = nanoid();
  const hashedPassword = await hash(password, 12);

  console.log('Creating user...');

  // Insert user
  await client`
    INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
    VALUES (${userId}, ${name}, ${email.toLowerCase()}, false, 'real-estate-agent', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
  `;

  // Insert credential account with password
  await client`
    INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
    VALUES (${accountId}, ${email.toLowerCase()}, 'credential', ${userId}, ${hashedPassword}, NOW(), NOW())
    ON CONFLICT DO NOTHING
  `;

  console.log('User created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('User ID:', userId);

  await client.end();
}

seedUser().catch(console.error);
