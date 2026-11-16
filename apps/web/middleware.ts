import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

/**
 * Lightweight middleware that checks session via JWT decode instead
 * of importing the full auth config (which pulls in bcryptjs / neon
 * that are incompatible with Edge Runtime).
 */
/**
 * Dev-only CORS for the API, so the Expo app running in a browser
 * (e.g. http://localhost:8081) can call this server. Native builds
 * aren't subject to CORS. The native app authenticates with Bearer
 * tokens, not cookies, so credentials aren't allowed.
 */
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function devCorsHeaders(request: NextRequest): Record<string, string> | null {
  if (process.env.NODE_ENV === 'production') return null;
  const origin = request.headers.get('origin');
  if (!origin || !LOCAL_ORIGIN.test(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const cors = devCorsHeaders(request);
    if (request.method === 'OPTIONS' && cors) {
      return new NextResponse(null, { status: 204, headers: cors });
    }
    const response = NextResponse.next();
    if (cors) {
      for (const [key, value] of Object.entries(cors)) response.headers.set(key, value);
    }
    return response;
  }

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
    '/api/:path*',
    '/org/:path*',
    '/tickets/:path*',
    '/profile/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
};