import { NextRequest, NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { account } from '@/db/schema';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'Current and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { status: 'fail', message: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Get user's credential account
    const [credentialAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, session.userId),
          eq(account.providerId, 'credential')
        )
      );

    if (!credentialAccount || !credentialAccount.password) {
      return NextResponse.json(
        { status: 'fail', message: 'Account not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, credentialAccount.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { status: 'fail', message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      } as any)
      .where(eq(account.id, credentialAccount.id));

    return NextResponse.json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('[POST /api/user/change-password]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to change password' },
      { status: 500 }
    );
  }
}
