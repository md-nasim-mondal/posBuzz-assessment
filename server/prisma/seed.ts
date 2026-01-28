
import 'dotenv/config';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string not found.');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const adminEmail = 'admin@posbuzz.com';
  const client = await pool.connect();

  try {
    // Check if admin exists
    const checkRes = await client.query(
      'SELECT id FROM "posbuzz"."User" WHERE email = $1',
      [adminEmail]
    );

    if (checkRes.rows.length === 0) {
      console.log('Creating Admin user...');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const name = 'Super Admin';
      const role = 'ADMIN';
      const isVerified = true;

      // Insert new admin
      await client.query(
        `INSERT INTO "posbuzz"."User" (id, email, password, name, role, "isVerified", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4::"posbuzz"."Role", $5, NOW(), NOW())`,
        [adminEmail, hashedPassword, name, role, isVerified]
      );
      console.log('✅ Admin user seeded: admin@posbuzz.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
