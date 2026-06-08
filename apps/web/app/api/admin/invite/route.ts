/**
 * POST /api/admin/invite
 * Promotes an existing user to admin. Only callable by admins.
 *
 * Body: { email: string }
 * Returns the updated user record.
 */

import { NextResponse } from 'next/server';
import { db, users } from '@boletify/db';
import { eq } from 'drizzle-orm';
import { decode } from 'next-auth/jwt';

async function getSessionFromRequest(request: Request) {
  const cookieName =
    process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [key, ...rest] = c.split('=');
      return [key, rest.join('=')];
    }),
  );

  const token = cookies[cookieName];
  if (!token) return null;

  try {
    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
    });
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // Verify the caller is an admin
  const session = await getSessionFromRequest(request);
  if (!session?.role || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Solo administradores pueden invitar admins' },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { error: 'Email es requerido' },
      { status: 400 },
    );
  }

  // Find the user
  const userList = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (userList.length === 0) {
    return NextResponse.json(
      { error: 'Usuario no encontrado. Debe tener una cuenta primero.' },
      { status: 404 },
    );
  }

  const user = userList[0];

  if (user.role === 'admin') {
    return NextResponse.json(
      { error: 'Este usuario ya es administrador' },
      { status: 409 },
    );
  }

  // Promote to admin
  const [updated] = await db
    .update(users)
    .set({ role: 'admin', updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    role: updated.role,
    message: `${updated.name || updated.email} ahora es administrador`,
  });
}
