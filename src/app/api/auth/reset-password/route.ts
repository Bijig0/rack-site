import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user, account, verification } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'Email, token, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { status: 'fail', message: 'Password must be at least 8 characters' },
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

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password in account table
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      } as any)
      .where(
        and(
          eq(account.userId, foundUser.id),
          eq(account.providerId, 'credential')
        )
      );

    // Delete used verification token
    await db
      .delete(verification)
      .where(eq(verification.id, verificationRecord.id));

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
