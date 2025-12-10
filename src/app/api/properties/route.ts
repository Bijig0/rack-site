import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { property } from '@/db/schema';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/auth';

/**
 * GET /api/properties
 * List all properties for the authenticated user.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userProperties = await db
      .select()
      .from(property)
      .where(eq(property.userId, session.userId));

    return NextResponse.json({
      status: 'success',
      payload: userProperties,
    });
  } catch (error) {
    console.error('[GET /api/properties]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/properties
 * Create a new property for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { addressCommonName } = body;
    if (!addressCommonName) {
      return NextResponse.json(
        {
          status: 'fail',
          message: 'Missing required field: addressCommonName',
        },
        { status: 400 }
      );
    }

    const newProperty = {
      id: randomUUID(),
      userId: session.userId,
      addressCommonName,
      addressLine: body.addressLine || null,
      suburb: body.suburb || null,
      state: body.state || null,
      postcode: body.postcode || null,
      propertyType: body.propertyType || null,
      bedroomCount: body.bedroomCount || null,
      bathroomCount: body.bathroomCount || null,
      landAreaSqm: body.landAreaSqm || null,
    };

    const [created] = await db.insert(property).values(newProperty as any).returning();

    return NextResponse.json(
      {
        status: 'success',
        message: 'Property created',
        payload: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/properties]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to create property' },
      { status: 500 }
    );
  }
}
