import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user, account } from '@/db/schema';
import { signToken, setAuthCookie } from '@/lib/auth';
import { createScopedLogger, startTimer } from '@/lib/logger';

const log = createScopedLogger('auth/login');

export async function POST(request: NextRequest) {
  const getElapsed = startTimer();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      log.warn('Login attempt with missing credentials', { hasEmail: !!email, hasPassword: !!password });
      return NextResponse.json(
        { status: 'fail', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()));

    if (!foundUser) {
      log.warn('Login attempt for non-existent user', { email: email.toLowerCase() });
      return NextResponse.json(
        { status: 'fail', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get the credential account (password stored in account table for BetterAuth)
    const [credentialAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, foundUser.id),
          eq(account.providerId, 'credential')
        )
      );

    if (!credentialAccount || !credentialAccount.password) {
      log.warn('Login attempt for user without credential account', { userId: foundUser.id });
      return NextResponse.json(
        { status: 'fail', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await compare(password, credentialAccount.password);
    if (!isPasswordValid) {
      log.warn('Login attempt with invalid password', { userId: foundUser.id });
      return NextResponse.json(
        { status: 'fail', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT and set cookie
    const token = await signToken({ userId: foundUser.id, email: foundUser.email });
    await setAuthCookie(token);

    log.info('User logged in successfully', { userId: foundUser.id, durationMs: getElapsed() });

    return NextResponse.json({
      status: 'success',
      message: 'Login successful',
      payload: {
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        },
      },
    });
  } catch (error) {
    log.error('Login failed', error, { durationMs: getElapsed() });
    return NextResponse.json(
      { status: 'fail', message: 'Login failed' },
      { status: 500 }
    );
  }
}
