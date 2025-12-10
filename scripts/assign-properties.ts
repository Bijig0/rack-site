import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../src/db/schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function assignProperties() {
  const email = 'bradysuryasie@gmail.com';

  // Find the user
  const [foundUser] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, email.toLowerCase()));

  if (!foundUser) {
    console.error('User not found with email:', email);
    await client.end();
    return;
  }

  console.log('Found user:', foundUser.id, foundUser.name);

  // Get all properties
  const allProperties = await db
    .select()
    .from(schema.property);

  console.log('Total properties:', allProperties.length);

  if (allProperties.length === 0) {
    console.log('No properties to update');
    await client.end();
    return;
  }

  // Update all properties to belong to this user
  const result = await db
    .update(schema.property)
    .set({ userId: foundUser.id } as any)
    .returning();

  console.log('Updated', result.length, 'properties to user:', foundUser.id);

  await client.end();
}

assignProperties().catch(console.error);
