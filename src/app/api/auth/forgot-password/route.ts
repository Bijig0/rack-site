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
      // Return success even if user not found (security)
      return NextResponse.json({
        status: 'success',
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = nanoid(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store verification token
    await db.insert(verification).values({
      id: nanoid(),
      identifier: email.toLowerCase(),
      value: resetToken,
      expiresAt,
    });

    // In production, you would send an email with the reset link
    // For now, just return success
    console.log(`[Password Reset] Token for ${email}: ${resetToken}`);

    return NextResponse.json({
      status: 'success',
      message: 'If an account exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('[POST /api/auth/forgot-password]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
