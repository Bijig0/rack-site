import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { status: 'fail', message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found' },
        { status: 404 }
      );
    }

    // Check OTP
    if (user.otp !== otp) {
      return NextResponse.json(
        { status: 'fail', message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check OTP expiry
    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return NextResponse.json(
        { status: 'fail', message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify user and clear OTP
    await db
      .update(users)
      .set({
        isVerified: true,
        status: 'active',
        otp: null,
        otpExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Create JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      status: 'success',
      message: 'Email verified successfully',
      payload: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
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
