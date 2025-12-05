import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { sendOtpEmail, generateOtp } from '@/lib/email';

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
      return NextResponse.json(
        { status: 'fail', message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { status: 'fail', message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Update user with new OTP
    await db
      .update(users)
      .set({
        otp,
        otpExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Send OTP email
    await sendOtpEmail(email, otp);

    return NextResponse.json({
      status: 'success',
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('[POST /api/auth/resend-otp]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to resend OTP' },
      { status: 500 }
    );
  }
}
