import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';

const sql = postgres(connectionString);

async function addAddressColumns() {
  try {
    // Check if columns exist
    const existingColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'property'
        AND column_name IN ('address_line', 'suburb', 'state', 'postcode')
    `;

    const existingColumnNames = existingColumns.map(c => c.column_name);

    // Add columns only if they don't exist
    if (!existingColumnNames.includes('address_line')) {
      await sql`ALTER TABLE property ADD COLUMN address_line TEXT`;
      console.log('Added address_line column');
    } else {
      console.log('address_line column already exists');
    }

    if (!existingColumnNames.includes('suburb')) {
      await sql`ALTER TABLE property ADD COLUMN suburb TEXT`;
      console.log('Added suburb column');
    } else {
      console.log('suburb column already exists');
    }

    if (!existingColumnNames.includes('state')) {
      await sql`ALTER TABLE property ADD COLUMN state TEXT`;
      console.log('Added state column');
    } else {
      console.log('state column already exists');
    }

    if (!existingColumnNames.includes('postcode')) {
      await sql`ALTER TABLE property ADD COLUMN postcode TEXT`;
      console.log('Added postcode column');
    } else {
      console.log('postcode column already exists');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

addAddressColumns();
