import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user, verification } from '@/db/schema';
import { nanoid } from 'nanoid';

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

    if (foundUser.emailVerified) {
      return NextResponse.json(
        { status: 'fail', message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = nanoid(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store verification token
    await db.insert(verification).values({
      id: nanoid(),
      identifier: email.toLowerCase(),
      value: verificationToken,
      expiresAt,
    });

    // In production, you would send an email with the verification link
    console.log(`[Email Verification] Token for ${email}: ${verificationToken}`);

    return NextResponse.json({
      status: 'success',
      message: 'Verification link sent successfully',
    });
  } catch (error) {
    console.error('[POST /api/auth/resend-otp]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to resend verification' },
      { status: 500 }
    );
  }
}
