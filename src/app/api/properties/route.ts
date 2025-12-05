import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { property, type NewProperty } from '@/db/schema';
import { randomUUID } from 'crypto';

// Hardcoded user ID for now until auth is integrated
const DEFAULT_USER_ID = 'agent-user-001';

/**
 * GET /api/properties
 * List all properties for the authenticated user.
 */
export async function GET() {
  try {
    const userProperties = await db
      .select()
      .from(property)
      .where(eq(property.userId, DEFAULT_USER_ID));

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

    const newProperty: NewProperty = {
      id: randomUUID(),
      userId: DEFAULT_USER_ID,
      addressCommonName,
      propertyType: body.propertyType || null,
      bedroomCount: body.bedroomCount || null,
      bathroomCount: body.bathroomCount || null,
      landAreaSqm: body.landAreaSqm || null,
      propertyImageUrl: body.propertyImageUrl || null,
    };

    const [created] = await db.insert(property).values(newProperty).returning();

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
