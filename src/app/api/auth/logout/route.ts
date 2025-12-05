import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    await removeAuthCookie();

    return NextResponse.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('[POST /api/auth/logout]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Logout failed' },
      { status: 500 }
    );
  }
}
