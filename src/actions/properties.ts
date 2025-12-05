'use server';

import { db } from '@/db/drizzle';
import { property, appraisal } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

// For now, use a hardcoded user ID until auth is fully integrated
// This will be replaced with actual session user ID
const DEFAULT_USER_ID = 'agent-user-001';

export type PropertyWithAppraisal = {
  id: string;
  userId: string;
  addressCommonName: string;
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  landAreaSqm: string | null;
  propertyImageUrl: string | null;
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

  // Batch fetch all appraisals for all properties in one query
  const propertyIds = properties.map(p => p.id);
  const allAppraisals = await db
    .select({
      id: appraisal.id,
      propertyId: appraisal.propertyId,
      status: appraisal.status,
      pdfUrl: appraisal.pdfUrl,
      createdAt: appraisal.createdAt,
    })
    .from(appraisal)
    .where(eq(appraisal.propertyId, propertyIds[0])) // Will be expanded below
    .orderBy(desc(appraisal.createdAt));

  // For now, fetch appraisals per property (can be optimized with SQL IN clause)
  const appraisalsByProperty = new Map<string, typeof allAppraisals>();

  // Batch fetch appraisals for all properties
  const appraisalPromises = propertyIds.map(async (propId) => {
    const propAppraisals = await db
      .select({
        id: appraisal.id,
        propertyId: appraisal.propertyId,
        status: appraisal.status,
        pdfUrl: appraisal.pdfUrl,
        createdAt: appraisal.createdAt,
      })
      .from(appraisal)
      .where(eq(appraisal.propertyId, propId))
      .orderBy(desc(appraisal.createdAt))
      .limit(1);
    return { propId, appraisals: propAppraisals };
  });

  const appraisalResults = await Promise.all(appraisalPromises);
  appraisalResults.forEach(({ propId, appraisals }) => {
    appraisalsByProperty.set(propId, appraisals);
  });

  // Map properties with their latest appraisal
  return properties.map((prop) => ({
    ...prop,
    latestAppraisal: appraisalsByProperty.get(prop.id)?.[0] || null,
  }));
}

/**
 * Cached version of getUserProperties - revalidates every 30 seconds or on-demand
 */
const getCachedUserProperties = unstable_cache(
  async (userId: string) => fetchUserProperties(userId),
  ['user-properties'],
  {
    revalidate: 30,
    tags: ['properties']
  }
);

/**
 * Get all properties for a user with their latest appraisal (cached)
 */
export async function getUserProperties(userId?: string): Promise<PropertyWithAppraisal[]> {
  const targetUserId = userId || DEFAULT_USER_ID;
  return getCachedUserProperties(targetUserId);
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
    revalidate: 30,
    tags: ['properties', 'property-count']
  }
);

/**
 * Get total property count for a user (cached)
 */
export async function getUserPropertyCount(userId?: string): Promise<number> {
  const targetUserId = userId || DEFAULT_USER_ID;
  return getCachedUserPropertyCount(targetUserId);
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

  return {
    ...prop,
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
export async function getAllPropertyIds(userId?: string): Promise<string[]> {
  const targetUserId = userId || DEFAULT_USER_ID;

  const properties = await db
    .select({ id: property.id })
    .from(property)
    .where(eq(property.userId, targetUserId));

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
