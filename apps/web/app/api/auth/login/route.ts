/**
 * POST /api/auth/login
 * Authenticates a user and returns a session token.
 * Used by the native app (web uses NextAuth's signIn() directly).
 *
 * Returns a simple JSON token that the native app stores in SecureStore.
 * The token is a base64-encoded JSON payload signed with a timestamp.
 * For production, swap this for proper JWT signing.
 */

import { NextResponse } from 'next/server';
import { verifyPassword } from '@boletify/api/utils/password';
import { db, users } from '@boletify/db';
import { eq } from 'drizzle-orm';
import { generateToken } from '../token';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 },
      );
    }

    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 },
      );
    }

    const user = userList[0];
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 },
      );
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
