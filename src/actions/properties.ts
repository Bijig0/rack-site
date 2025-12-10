'use server';

import { db } from '@/db/drizzle';
import { property, appraisal, propertyImage } from '@/db/schema';
import { eq, desc, count, inArray, sql, and } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { cache } from 'react';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get current authenticated user ID
 * Throws if not authenticated
 */
async function getAuthenticatedUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Not authenticated');
  }
  return session.userId;
}

export type PropertyWithAppraisal = {
  id: string;
  userId: string;
  addressCommonName: string;
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  landAreaSqm: string | null;
  mainImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  latestAppraisal: {
    id: string;
    status: string;
    pdfUrl: string | null;
    createdAt: Date;
  } | null;
};

/**
 * Internal function to fetch properties (used by cached version)
 */
async function fetchUserProperties(targetUserId: string): Promise<PropertyWithAppraisal[]> {
  // Get all properties for the user with a single optimized query
  const properties = await db
    .select()
    .from(property)
    .where(eq(property.userId, targetUserId))
    .orderBy(desc(property.createdAt));

  if (properties.length === 0) {
    return [];
  }

  const propertyIds = properties.map(p => p.id);

  // Batch fetch all appraisals for all properties in ONE query using IN clause
  const allAppraisals = await db
    .select({
      id: appraisal.id,
      propertyId: appraisal.propertyId,
      status: appraisal.status,
      pdfUrl: appraisal.pdfUrl,
      createdAt: appraisal.createdAt,
    })
    .from(appraisal)
    .where(inArray(appraisal.propertyId, propertyIds))
    .orderBy(desc(appraisal.createdAt));

  // Batch fetch all main images for all properties in ONE query
  const allImages = await db
    .select({
      propertyId: propertyImage.propertyId,
      url: propertyImage.url,
    })
    .from(propertyImage)
    .where(and(
      inArray(propertyImage.propertyId, propertyIds),
      eq(propertyImage.type, 'main')
    ));

  // Map images by property ID (just get the first main image for each)
  const mainImageByProperty = new Map<string, string>();
  for (const img of allImages) {
    if (!mainImageByProperty.has(img.propertyId)) {
      mainImageByProperty.set(img.propertyId, img.url);
    }
  }

  // Group appraisals by property and get the latest one for each
  const latestAppraisalByProperty = new Map<string, typeof allAppraisals[0]>();
  for (const apr of allAppraisals) {
    // Since we ordered by createdAt desc, the first one we see for each property is the latest
    if (!latestAppraisalByProperty.has(apr.propertyId)) {
      latestAppraisalByProperty.set(apr.propertyId, apr);
    }
  }

  // Map properties with their latest appraisal and main image
  return properties.map((prop) => ({
    ...prop,
    mainImageUrl: mainImageByProperty.get(prop.id) || null,
    latestAppraisal: latestAppraisalByProperty.get(prop.id) || null,
  }));
}

/**
 * Cached version of getUserProperties - revalidates every 60 seconds or on-demand
 * Extended cache time for faster navigation
 */
const getCachedUserProperties = unstable_cache(
  async (userId: string) => fetchUserProperties(userId),
  ['user-properties'],
  {
    revalidate: 60, // Extended to 60 seconds for smoother navigation
    tags: ['properties']
  }
);

/**
 * Request-level cache to dedupe multiple calls in the same render
 */
const getRequestCachedProperties = cache(async (userId: string) => {
  return getCachedUserProperties(userId);
});

/**
 * Get all properties for a user with their latest appraisal (cached)
 * Uses both request-level cache and persistent cache for instant loads
 */
export async function getUserProperties(): Promise<PropertyWithAppraisal[]> {
  const userId = await getAuthenticatedUserId();
  return getRequestCachedProperties(userId);
}

/**
 * Internal function to fetch property count
 */
async function fetchUserPropertyCount(targetUserId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(property)
    .where(eq(property.userId, targetUserId));

  return result[0]?.count || 0;
}

/**
 * Cached version of getUserPropertyCount
 */
const getCachedUserPropertyCount = unstable_cache(
  async (userId: string) => fetchUserPropertyCount(userId),
  ['user-property-count'],
  {
    revalidate: 60,
    tags: ['properties', 'property-count']
  }
);

/**
 * Request-level cache for property count
 */
const getRequestCachedPropertyCount = cache(async (userId: string) => {
  return getCachedUserPropertyCount(userId);
});

/**
 * Get total property count for a user (cached)
 */
export async function getUserPropertyCount(): Promise<number> {
  const userId = await getAuthenticatedUserId();
  return getRequestCachedPropertyCount(userId);
}

/**
 * Internal function to fetch single property
 */
async function fetchPropertyById(propertyId: string) {
  const properties = await db
    .select()
    .from(property)
    .where(eq(property.id, propertyId))
    .limit(1);

  if (properties.length === 0) {
    return null;
  }

  const prop = properties[0];

  // Get all appraisals for the property
  const appraisals = await db
    .select()
    .from(appraisal)
    .where(eq(appraisal.propertyId, propertyId))
    .orderBy(desc(appraisal.createdAt));

  // Get all images for the property
  const images = await db
    .select()
    .from(propertyImage)
    .where(eq(propertyImage.propertyId, propertyId))
    .orderBy(propertyImage.sortOrder);

  // Get the main image URL
  const mainImage = images.find(img => img.type === 'main');
  const mainImageUrl = mainImage?.url || null;

  return {
    ...prop,
    mainImageUrl,
    images,
    appraisals,
  };
}

/**
 * Cached version of getPropertyById
 */
const getCachedPropertyById = unstable_cache(
  async (propertyId: string) => fetchPropertyById(propertyId),
  ['property-by-id'],
  {
    revalidate: 60,
    tags: ['properties']
  }
);

/**
 * Get a single property by ID (cached)
 */
export async function getPropertyById(propertyId: string) {
  return getCachedPropertyById(propertyId);
}

/**
 * Get all property IDs for prefetching/static generation
 */
export async function getAllPropertyIds(): Promise<string[]> {
  const userId = await getAuthenticatedUserId();

  const properties = await db
    .select({ id: property.id })
    .from(property)
    .where(eq(property.userId, userId));

  return properties.map(p => p.id);
}

/**
 * Revalidate all property caches - call this after creating/updating/deleting properties
 */
export async function revalidateProperties() {
  revalidateTag('properties');
}

/**
 * Revalidate a specific property cache
 */
export async function revalidateProperty(propertyId: string) {
  revalidateTag('properties');
  revalidateTag(`property-${propertyId}`);
}

/**
 * Delete a property and all its associated appraisals
 * Only the owner can delete their property
 */
export async function deleteProperty(propertyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();

    // Verify the property belongs to the current user
    const existingProperty = await db
      .select({ id: property.id, userId: property.userId })
      .from(property)
      .where(eq(property.id, propertyId))
      .limit(1);

    if (existingProperty.length === 0) {
      return { success: false, error: 'Property not found' };
    }

    if (existingProperty[0].userId !== userId) {
      return { success: false, error: 'You do not have permission to delete this property' };
    }

    // Delete all appraisals for this property first (due to foreign key constraint)
    await db.delete(appraisal).where(eq(appraisal.propertyId, propertyId));

    // Delete the property
    await db.delete(property).where(eq(property.id, propertyId));

    // Revalidate the cache
    revalidateTag('properties');

    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: 'Failed to delete property' };
  }
}

/**
 * Create a new property
 */
export interface CreatePropertyInput {
  addressLine: string;
  suburb: string;
  state: string;
  postcode: string;
}

export async function createProperty(input: CreatePropertyInput): Promise<{ success: boolean; propertyId?: string; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();

    // Build the common name from address components
    const addressCommonName = `${input.addressLine}, ${input.suburb} ${input.state} ${input.postcode}`;

    const propertyId = uuidv4();

    // Use raw SQL to insert with all fields
    await db.execute(sql`
      INSERT INTO property (id, user_id, address_common_name, address_line, suburb, state, postcode, created_at, updated_at)
      VALUES (${propertyId}, ${userId}, ${addressCommonName}, ${input.addressLine}, ${input.suburb}, ${input.state}, ${input.postcode}, NOW(), NOW())
    `);

    // Revalidate the cache
    revalidateTag('properties');

    return { success: true, propertyId };
  } catch (error) {
    console.error('Error creating property:', error);
    return { success: false, error: 'Failed to create property' };
  }
}

/**
 * Update property details
 */
export interface UpdatePropertyInput {
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  landAreaSqm: string | null;
  mainImageUrl: string | null;
}

export async function updateProperty(
  propertyId: string,
  input: UpdatePropertyInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();

    // Verify the property belongs to the current user
    const existingProperty = await db
      .select({ id: property.id, userId: property.userId })
      .from(property)
      .where(eq(property.id, propertyId))
      .limit(1);

    if (existingProperty.length === 0) {
      return { success: false, error: 'Property not found' };
    }

    if (existingProperty[0].userId !== userId) {
      return { success: false, error: 'You do not have permission to update this property' };
    }

    // Update the property
    await db
      .update(property)
      .set({
        bedroomCount: input.bedroomCount,
        bathroomCount: input.bathroomCount,
        propertyType: input.propertyType,
        landAreaSqm: input.landAreaSqm,
        updatedAt: new Date(),
      })
      .where(eq(property.id, propertyId));

    // Handle main image
    if (input.mainImageUrl !== null) {
      // Delete existing main image
      await db
        .delete(propertyImage)
        .where(and(
          eq(propertyImage.propertyId, propertyId),
          eq(propertyImage.type, 'main')
        ));

      // Insert new main image if URL provided
      if (input.mainImageUrl) {
        await db.insert(propertyImage).values({
          id: uuidv4(),
          propertyId,
          url: input.mainImageUrl,
          type: 'main',
          sortOrder: 0,
        });
      }
    }

    // Revalidate the cache
    revalidateTag('properties');

    return { success: true };
  } catch (error) {
    console.error('Error updating property:', error);
    return { success: false, error: 'Failed to update property' };
  }
}
