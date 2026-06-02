/**
 * POST /api/dev/setup-organiser
 * TEMPORARY dev-only endpoint to create a test organiser account.
 * Uses raw neon() tagged templates to avoid Drizzle+Neon version mismatch.
 * DELETE THIS FILE before deploying to production.
 */

import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { genSalt, hash } from 'bcryptjs';

export async function POST() {
  try {
    const sql = neon(process.env.BOLETIFY_DATABASE_URL!);
    const email = 'org@boletify.com';
    const rawPassword = 'org12345';
    const name = 'Carlos Organiser';

    // Hash password
    const salt = await genSalt(10);
    const passwordHash = await hash(rawPassword, salt);

    // Check if user exists
    const existing = await sql`SELECT id, role FROM users WHERE email = ${email} LIMIT 1`;

    let userId: number;

    if (existing.length === 0) {
      const created = await sql`
        INSERT INTO users (email, password_hash, name, role)
        VALUES (${email}, ${passwordHash}, ${name}, 'organiser')
        RETURNING id
      `;
      userId = created[0].id;
    } else {
      userId = existing[0].id;
      // Ensure role is organiser
      if (existing[0].role !== 'organiser') {
        await sql`UPDATE users SET role = 'organiser' WHERE id = ${userId}`;
      }
    }

    // Check/create organiser profile
    const profiles = await sql`SELECT id FROM organiser_profiles WHERE user_id = ${userId} LIMIT 1`;

    let organiserId: number;
    if (profiles.length === 0) {
      const created = await sql`
        INSERT INTO organiser_profiles (user_id, organiser_name, bio, slug)
        VALUES (${userId}, 'Boletify Events', 'Organizador de eventos en CDMX', 'boletify-events')
        RETURNING id
      `;
      organiserId = created[0].id;
    } else {
      organiserId = profiles[0].id;
    }

    // Reassign all orphan events to this organiser (events whose organiser_id doesn't match)
    await sql`UPDATE events SET organiser_id = ${organiserId} WHERE organiser_id != ${organiserId} OR organiser_id IS NULL`;

    return NextResponse.json({
      success: true,
      credentials: { email, password: rawPassword },
      userId,
      organiserId,
      message: 'Login with org@boletify.com / org12345',
    });
  } catch (err: any) {
    console.error('Setup organiser error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
