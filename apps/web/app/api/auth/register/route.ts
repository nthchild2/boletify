/**
 * POST /api/auth/register
 * Creates a new user account.
 * Used by both the web sign-up form and the native app.
 */

import { NextResponse } from 'next/server';
import { hashPassword } from '@boletify/api/utils/password';
import { db, users } from '@boletify/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role: requestedRole } = body;

    // Only allow buyer or organiser self-signup. Admin is invite-only.
    const role = requestedRole === 'organiser' ? 'organiser' : 'buyer';

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 },
      );
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 },
      );
    }

    // Check for existing user
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 },
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        role,
      })
      .returning();

    if (!newUser[0]) {
      return NextResponse.json(
        { error: 'No se pudo crear la cuenta' },
        { status: 500 },
      );
    }

    // If organiser, auto-create organiser profile
    if (role === 'organiser') {
      const { organiserProfiles } = await import('@boletify/db/schema');
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        || `org-${newUser[0].id}`;

      await db.insert(organiserProfiles).values({
        userId: newUser[0].id,
        organiserName: body.organiserName || name,
        slug,
        isApproved: true,
      });
    }

    return NextResponse.json({
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      role: newUser[0].role,
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
