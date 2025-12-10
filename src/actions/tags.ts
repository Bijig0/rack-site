'use server';

import { db } from '@/db/drizzle';
import { propertyTag, property } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get current authenticated user ID
 */
async function getAuthenticatedUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Not authenticated');
  }
  return session.userId;
}

/**
 * Verify user owns the property
 */
async function verifyPropertyOwnership(propertyId: string): Promise<boolean> {
  const userId = await getAuthenticatedUserId();
  const prop = await db
    .select({ userId: property.userId })
    .from(property)
    .where(eq(property.id, propertyId))
    .limit(1);

  return prop.length > 0 && prop[0].userId === userId;
}

// ============================================================================
// Types
// ============================================================================

export type TagData = {
  id: string;
  propertyId: string;
  value: string;
  createdAt: Date;
};

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Get all tags for a property
 */
export async function getPropertyTags(propertyId: string): Promise<TagData[]> {
  const hasAccess = await verifyPropertyOwnership(propertyId);
  if (!hasAccess) {
    throw new Error('Access denied');
  }

  const tags = await db
    .select()
    .from(propertyTag)
    .where(eq(propertyTag.propertyId, propertyId));

  return tags.map(tag => ({
    id: tag.id,
    propertyId: tag.propertyId,
    value: tag.value,
    createdAt: tag.createdAt,
  }));
}

// ============================================================================
// Write Operations
// ============================================================================

/**
 * Add a tag to a property
 */
export async function addPropertyTag(
  propertyId: string,
  value: string
): Promise<{ success: boolean; tagId?: string; error?: string }> {
  try {
    const hasAccess = await verifyPropertyOwnership(propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return { success: false, error: 'Tag value cannot be empty' };
    }

    // Check if tag already exists for this property
    const existingTag = await db
      .select()
      .from(propertyTag)
      .where(eq(propertyTag.propertyId, propertyId));

    if (existingTag.some(t => t.value.toLowerCase() === trimmedValue.toLowerCase())) {
      return { success: false, error: 'Tag already exists' };
    }

    const tagId = uuidv4();

    await db.insert(propertyTag).values({
      id: tagId,
      propertyId,
      value: trimmedValue,
    });

    revalidateTag('properties');
    return { success: true, tagId };
  } catch (error) {
    console.error('Error adding tag:', error);
    return { success: false, error: 'Failed to add tag' };
  }
}

/**
 * Remove a tag from a property
 */
export async function removePropertyTag(
  tagId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const tag = await db
      .select({ propertyId: propertyTag.propertyId })
      .from(propertyTag)
      .where(eq(propertyTag.id, tagId))
      .limit(1);

    if (tag.length === 0) {
      return { success: false, error: 'Tag not found' };
    }

    const hasAccess = await verifyPropertyOwnership(tag[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    await db.delete(propertyTag).where(eq(propertyTag.id, tagId));

    revalidateTag('properties');
    return { success: true };
  } catch (error) {
    console.error('Error removing tag:', error);
    return { success: false, error: 'Failed to remove tag' };
  }
}
