import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { sendOtpEmail, generateOtp } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { status: 'fail', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existingUser) {
      return NextResponse.json(
        { status: 'fail', message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate OTP
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        fullName: fullName || '',
        email: email.toLowerCase(),
        password: hashedPassword,
        otp,
        otpExpiresAt,
        status: 'inactive',
        isVerified: false,
      })
      .returning({ id: users.id, email: users.email });

    // Send OTP email
    await sendOtpEmail(email, otp);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Registration successful. Please check your email for verification code.',
        payload: { email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/auth/register]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Registration failed' },
      { status: 500 }
    );
  }
}
