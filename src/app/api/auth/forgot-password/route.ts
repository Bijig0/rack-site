import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { sendPasswordResetEmail, generateOtp } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { status: 'fail', message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      // Return success even if user not found (security)
      return NextResponse.json({
        status: 'success',
        message: 'If an account exists, a reset code has been sent',
      });
    }

    // Generate reset OTP
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Update user with reset OTP
    await db
      .update(users)
      .set({
        resetPasswordOtp: otp,
        resetPasswordOtpExpiresAt: otpExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Send reset email
    await sendPasswordResetEmail(email, otp);

    return NextResponse.json({
      status: 'success',
      message: 'If an account exists, a reset code has been sent',
    });
  } catch (error) {
    console.error('[POST /api/auth/forgot-password]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
