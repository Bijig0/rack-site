import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { property } from '@/db/schema';
import { getSession } from '@/lib/auth';

/**
 * GET /api/properties/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [foundProperty] = await db
      .select()
      .from(property)
      .where(
        and(
          eq(property.id, id),
          eq(property.userId, session.userId)
        )
      );

    if (!foundProperty) {
      return NextResponse.json(
        { status: 'fail', message: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      payload: foundProperty,
    });
  } catch (error) {
    console.error('[GET /api/properties/[id]]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/properties/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (body.addressCommonName !== undefined) updateData.addressCommonName = body.addressCommonName;
    if (body.propertyType !== undefined) updateData.propertyType = body.propertyType;
    if (body.bedroomCount !== undefined) updateData.bedroomCount = body.bedroomCount;
    if (body.bathroomCount !== undefined) updateData.bathroomCount = body.bathroomCount;
    if (body.landAreaSqm !== undefined) updateData.landAreaSqm = body.landAreaSqm;

    const [updated] = await db
      .update(property)
      .set(updateData as any)
      .where(
        and(
          eq(property.id, id),
          eq(property.userId, session.userId)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { status: 'fail', message: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Property updated',
      payload: updated,
    });
  } catch (error) {
    console.error('[PUT /api/properties/[id]]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to update property' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/properties/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [deleted] = await db
      .delete(property)
      .where(
        and(
          eq(property.id, id),
          eq(property.userId, session.userId)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { status: 'fail', message: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Property deleted',
    });
  } catch (error) {
    console.error('[DELETE /api/properties/[id]]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
