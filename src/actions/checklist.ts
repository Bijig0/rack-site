'use server';

import { db } from '@/db/drizzle';
import { checklistGroup, checklistItem, property } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
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

export type ChecklistItemData = {
  id: string;
  groupId: string;
  name: string;
  valueType: 'text' | 'number' | 'boolean' | 'date';
  value: string | null;
  isCompleted: boolean;
  sortOrder: number;
};

export type ChecklistGroupData = {
  id: string;
  propertyId: string;
  name: string;
  sortOrder: number;
  items: ChecklistItemData[];
};

export type ChecklistStats = {
  total: number;
  completed: number;
  pending: number;
};

// ============================================================================
// Read Operations
// ============================================================================

/**
 * Get all checklist groups and items for a property
 */
export async function getPropertyChecklists(propertyId: string): Promise<ChecklistGroupData[]> {
  const hasAccess = await verifyPropertyOwnership(propertyId);
  if (!hasAccess) {
    throw new Error('Access denied');
  }

  const groups = await db
    .select()
    .from(checklistGroup)
    .where(eq(checklistGroup.propertyId, propertyId))
    .orderBy(asc(checklistGroup.sortOrder));

  const groupsWithItems: ChecklistGroupData[] = [];

  for (const group of groups) {
    const items = await db
      .select()
      .from(checklistItem)
      .where(eq(checklistItem.groupId, group.id))
      .orderBy(asc(checklistItem.sortOrder));

    groupsWithItems.push({
      id: group.id,
      propertyId: group.propertyId,
      name: group.name,
      sortOrder: group.sortOrder,
      items: items.map(item => ({
        id: item.id,
        groupId: item.groupId,
        name: item.name,
        valueType: item.valueType as 'text' | 'number' | 'boolean' | 'date',
        value: item.value,
        isCompleted: item.isCompleted,
        sortOrder: item.sortOrder,
      })),
    });
  }

  return groupsWithItems;
}

/**
 * Get checklist stats for a property
 */
export async function getChecklistStats(propertyId: string): Promise<ChecklistStats> {
  const groups = await getPropertyChecklists(propertyId);

  let total = 0;
  let completed = 0;

  for (const group of groups) {
    for (const item of group.items) {
      total++;
      if (item.isCompleted) {
        completed++;
      }
    }
  }

  return {
    total,
    completed,
    pending: total - completed,
  };
}

// ============================================================================
// Group Operations
// ============================================================================

/**
 * Create a new checklist group
 */
export async function createChecklistGroup(
  propertyId: string,
  name: string
): Promise<{ success: boolean; groupId?: string; error?: string }> {
  try {
    const hasAccess = await verifyPropertyOwnership(propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    // Get max sort order
    const existingGroups = await db
      .select({ sortOrder: checklistGroup.sortOrder })
      .from(checklistGroup)
      .where(eq(checklistGroup.propertyId, propertyId))
      .orderBy(asc(checklistGroup.sortOrder));

    const maxSortOrder = existingGroups.length > 0
      ? Math.max(...existingGroups.map(g => g.sortOrder)) + 1
      : 0;

    const groupId = uuidv4();

    await db.insert(checklistGroup).values({
      id: groupId,
      propertyId,
      name,
      sortOrder: maxSortOrder,
    });

    revalidateTag('properties');
    return { success: true, groupId };
  } catch (error) {
    console.error('Error creating checklist group:', error);
    return { success: false, error: 'Failed to create checklist group' };
  }
}

/**
 * Update a checklist group name
 */
export async function updateChecklistGroup(
  groupId: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const group = await db
      .select({ propertyId: checklistGroup.propertyId })
      .from(checklistGroup)
      .where(eq(checklistGroup.id, groupId))
      .limit(1);

    if (group.length === 0) {
      return { success: false, error: 'Group not found' };
    }

    const hasAccess = await verifyPropertyOwnership(group[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    await db
      .update(checklistGroup)
      .set({ name, updatedAt: new Date() })
      .where(eq(checklistGroup.id, groupId));

    revalidateTag('properties');
    return { success: true };
  } catch (error) {
    console.error('Error updating checklist group:', error);
    return { success: false, error: 'Failed to update checklist group' };
  }
}

/**
 * Delete a checklist group
 */
export async function deleteChecklistGroup(
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const group = await db
      .select({ propertyId: checklistGroup.propertyId })
      .from(checklistGroup)
      .where(eq(checklistGroup.id, groupId))
      .limit(1);

    if (group.length === 0) {
      return { success: false, error: 'Group not found' };
    }

    const hasAccess = await verifyPropertyOwnership(group[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    // Items will be deleted automatically due to cascade
    await db.delete(checklistGroup).where(eq(checklistGroup.id, groupId));

    revalidateTag('properties');
    return { success: true };
  } catch (error) {
    console.error('Error deleting checklist group:', error);
    return { success: false, error: 'Failed to delete checklist group' };
  }
}

// ============================================================================
// Item Operations
// ============================================================================

/**
 * Create a new checklist item
 */
export async function createChecklistItem(
  groupId: string,
  name: string,
  valueType: 'text' | 'number' | 'boolean' | 'date' = 'text'
): Promise<{ success: boolean; itemId?: string; error?: string }> {
  try {
    const group = await db
      .select({ propertyId: checklistGroup.propertyId })
      .from(checklistGroup)
      .where(eq(checklistGroup.id, groupId))
      .limit(1);

    if (group.length === 0) {
      return { success: false, error: 'Group not found' };
    }

    const hasAccess = await verifyPropertyOwnership(group[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    // Get max sort order
    const existingItems = await db
      .select({ sortOrder: checklistItem.sortOrder })
      .from(checklistItem)
      .where(eq(checklistItem.groupId, groupId))
      .orderBy(asc(checklistItem.sortOrder));

    const maxSortOrder = existingItems.length > 0
      ? Math.max(...existingItems.map(i => i.sortOrder)) + 1
      : 0;

    const itemId = uuidv4();

    await db.insert(checklistItem).values({
      id: itemId,
      groupId,
      name,
      valueType,
      sortOrder: maxSortOrder,
    });

    revalidateTag('properties');
    return { success: true, itemId };
  } catch (error) {
    console.error('Error creating checklist item:', error);
    return { success: false, error: 'Failed to create checklist item' };
  }
}

/**
 * Update a checklist item
 */
export async function updateChecklistItem(
  itemId: string,
  updates: {
    name?: string;
    valueType?: 'text' | 'number' | 'boolean' | 'date';
    value?: string | null;
    isCompleted?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const item = await db
      .select({ groupId: checklistItem.groupId })
      .from(checklistItem)
      .where(eq(checklistItem.id, itemId))
      .limit(1);

    if (item.length === 0) {
      return { success: false, error: 'Item not found' };
    }

    const group = await db
      .select({ propertyId: checklistGroup.propertyId })
      .from(checklistGroup)
      .where(eq(checklistGroup.id, item[0].groupId))
      .limit(1);

    if (group.length === 0) {
      return { success: false, error: 'Group not found' };
    }

    const hasAccess = await verifyPropertyOwnership(group[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    await db
      .update(checklistItem)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(checklistItem.id, itemId));

    revalidateTag('properties');
    return { success: true };
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return { success: false, error: 'Failed to update checklist item' };
  }
}

/**
 * Toggle checklist item completion
 */
export async function toggleChecklistItem(
  itemId: string
): Promise<{ success: boolean; isCompleted?: boolean; error?: string }> {
  try {
    const item = await db
      .select({
        groupId: checklistItem.groupId,
        isCompleted: checklistItem.isCompleted
      })
      .from(checklistItem)
      .where(eq(checklistItem.id, itemId))
      .limit(1);

    if (item.length === 0) {
      return { success: false, error: 'Item not found' };
    }

    const group = await db
      .select({ propertyId: checklistGroup.propertyId })
      .from(checklistGroup)
      .where(eq(checklistGroup.id, item[0].groupId))
      .limit(1);

    if (group.length === 0) {
      return { success: false, error: 'Group not found' };
    }

    const hasAccess = await verifyPropertyOwnership(group[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    const newIsCompleted = !item[0].isCompleted;

    await db
      .update(checklistItem)
      .set({ isCompleted: newIsCompleted, updatedAt: new Date() })
      .where(eq(checklistItem.id, itemId));

    revalidateTag('properties');
    return { success: true, isCompleted: newIsCompleted };
  } catch (error) {
    console.error('Error toggling checklist item:', error);
    return { success: false, error: 'Failed to toggle checklist item' };
  }
}

/**
 * Delete a checklist item
 */
export async function deleteChecklistItem(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const item = await db
      .select({ groupId: checklistItem.groupId })
      .from(checklistItem)
      .where(eq(checklistItem.id, itemId))
      .limit(1);

    if (item.length === 0) {
      return { success: false, error: 'Item not found' };
    }

    const group = await db
      .select({ propertyId: checklistGroup.propertyId })
      .from(checklistGroup)
      .where(eq(checklistGroup.id, item[0].groupId))
      .limit(1);

    if (group.length === 0) {
      return { success: false, error: 'Group not found' };
    }

    const hasAccess = await verifyPropertyOwnership(group[0].propertyId);
    if (!hasAccess) {
      return { success: false, error: 'Access denied' };
    }

    await db.delete(checklistItem).where(eq(checklistItem.id, itemId));

    revalidateTag('properties');
    return { success: true };
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    return { success: false, error: 'Failed to delete checklist item' };
  }
}
