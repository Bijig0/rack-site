import { NextRequest, NextResponse } from 'next/server';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user, verification } from '@/db/schema';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { status: 'fail', message: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Find verification token
    const [verificationRecord] = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.identifier, email.toLowerCase()),
          eq(verification.value, token),
          gt(verification.expiresAt, new Date())
        )
      );

    if (!verificationRecord) {
      return NextResponse.json(
        { status: 'fail', message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Find user
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()));

    if (!foundUser) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found' },
        { status: 404 }
      );
    }

    // Mark user as verified
    await db
      .update(user)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, foundUser.id));

    // Delete used verification token
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id));

    // Create JWT and set cookie
    const jwtToken = await signToken({ userId: foundUser.id, email: foundUser.email });
    await setAuthCookie(jwtToken);

    return NextResponse.json({
      status: 'success',
      message: 'Email verified successfully',
      payload: {
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        },
      },
    });
  } catch (error) {
    console.error('[POST /api/auth/verify-otp]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Verification failed' },
      { status: 500 }
    );
  }
}
