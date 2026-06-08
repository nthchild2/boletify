/**
 * One-time script to seed the initial admin account.
 * Run: npx tsx packages/db/seed-admin.ts
 *
 * If the user exists, promotes them to admin.
 * If not, creates a new admin account.
 */

import { neon } from '@neondatabase/serverless';
import { createHash } from 'crypto';

const ADMIN_EMAIL = 'nth.child.1@gmail.com';
const ADMIN_NAME = 'Carlos';

async function seedAdmin() {
  const sql = neon(process.env.BOLETIFY_DATABASE_URL!);

  // Check if user exists
  const existing = await sql`
    SELECT id, email, role FROM users WHERE email = ${ADMIN_EMAIL} LIMIT 1
  `;

  if (existing.length > 0) {
    if (existing[0].role === 'admin') {
      console.log(`✅ ${ADMIN_EMAIL} is already an admin (id=${existing[0].id})`);
      return;
    }

    // Promote existing user
    await sql`
      UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = ${existing[0].id}
    `;
    console.log(`✅ Promoted ${ADMIN_EMAIL} to admin (id=${existing[0].id}, was: ${existing[0].role})`);
    return;
  }

  // Create new admin account — you'll need to set a password via the signin page
  // or use the hash below. For now we'll create with a placeholder hash.
  // You should sign up normally first, then run this script to promote.
  console.log(`❌ No account found for ${ADMIN_EMAIL}.`);
  console.log(`   Sign up at /auth/signup first, then run this script again to promote to admin.`);
}

seedAdmin().catch(console.error);
