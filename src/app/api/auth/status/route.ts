import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: {
          userId: session.userId,
          email: session.email,
        },
      });
    }

    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  } catch (error) {
    console.error('[GET /api/auth/status]', error);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
