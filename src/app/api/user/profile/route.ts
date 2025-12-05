import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user } from '@/db/schema';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [foundUser] = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, session.userId));

    if (!foundUser) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      payload: foundUser,
    });
  } catch (error) {
    console.error('[GET /api/user/profile]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.image !== undefined) updateData.image = body.image;

    const [updated] = await db
      .update(user)
      .set(updateData as any)
      .where(eq(user.id, session.userId))
      .returning({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      });

    return NextResponse.json({
      status: 'success',
      message: 'Profile updated',
      payload: updated,
    });
  } catch (error) {
    console.error('[PUT /api/user/profile]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
