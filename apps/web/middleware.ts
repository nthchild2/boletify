import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

/**
 * Lightweight middleware that checks session via JWT decode instead
 * of importing the full auth config (which pulls in bcryptjs / neon
 * that are incompatible with Edge Runtime).
 */
export async function middleware(request: NextRequest) {
  // NextAuth v5 uses __Secure- prefix in production, no prefix in dev
  const cookieName =
    process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';

  const token = request.cookies.get(cookieName)?.value;
  let session: { email?: string; role?: string } | null = null;

  if (token) {
    try {
      const decoded = await decode({
        token,
        secret: process.env.AUTH_SECRET!,
        salt: cookieName,
      });
      if (decoded?.email) {
        session = { email: decoded.email as string, role: decoded.role as string };
      }
    } catch {
      // Invalid or expired token — treat as unauthenticated
    }
  }

  const isAuthenticated = !!session?.email;

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/org') ||
    request.nextUrl.pathname.startsWith('/tickets') ||
    request.nextUrl.pathname.startsWith('/profile');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth/signin') ||
    request.nextUrl.pathname.startsWith('/auth/signup');

  // If trying to access protected route without session
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login/register
  if (isAuthRoute && isAuthenticated) {
    const destination = session?.role === 'organiser' ? '/org/dashboard' : '/';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/org/:path*',
    '/tickets/:path*',
    '/profile/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
};