import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Note: Middleware runs on Edge runtime and cannot import the full config module.
// JWT_SECRET is validated at server startup via config.ts, so this will fail
// appropriately if the env var is not set.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if user is authenticated
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*',
    // Match auth routes
    '/login',
    '/register',
  ],
};
