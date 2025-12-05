import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'Email, OTP, and new password are required' },
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
        { status: 'fail', message: 'Invalid request' },
        { status: 400 }
      );
    }

    // Check reset OTP
    if (user.resetPasswordOtp !== otp) {
      return NextResponse.json(
        { status: 'fail', message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check OTP expiry
    if (!user.resetPasswordOtpExpiresAt || new Date() > user.resetPasswordOtpExpiresAt) {
      return NextResponse.json(
        { status: 'fail', message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password and clear reset OTP
    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordChangedAt: new Date(),
        resetPasswordOtp: null,
        resetPasswordOtpExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      status: 'success',
      message: 'Password reset successful. Please log in.',
    });
  } catch (error) {
    console.error('[POST /api/auth/reset-password]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Password reset failed' },
      { status: 500 }
    );
  }
}
