import { auth } from '../../lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/org') ||
    request.nextUrl.pathname.startsWith('/tickets') ||
    request.nextUrl.pathname.startsWith('/profile');
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');

  // If trying to access protected route without session
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login/register
  if (isAuthRoute && session) {
    // Redirect to home or dashboard based on role
    const destination = session.user?.role === 'organiser' ? '/org/dashboard' : '/';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/org/:path*',
    '/tickets/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};