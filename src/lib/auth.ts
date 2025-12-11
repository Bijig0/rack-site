import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { env, isProduction } from '@/lib/config';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function signToken(payload: { userId: string; email: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Internal session fetch - wrapped by cache() below
 */
async function fetchSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  console.log('[getSession] Token exists:', !!token);
  if (!token) return null;

  const result = await verifyToken(token);
  console.log('[getSession] Token valid:', !!result);
  return result;
}

/**
 * Get the current session - cached per request to avoid repeated JWT verification
 */
export const getSession = cache(fetchSession);

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
