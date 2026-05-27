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
    const { name, email, password } = body;

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
        role: 'buyer',
      })
      .returning();

    if (!newUser[0]) {
      return NextResponse.json(
        { error: 'No se pudo crear la cuenta' },
        { status: 500 },
      );
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
