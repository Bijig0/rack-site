import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
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

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId));

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      payload: user,
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
    const updateData: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.fullName !== undefined) updateData.fullName = body.fullName;
    if (body.image !== undefined) updateData.image = body.image;

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.userId))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        image: users.image,
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
