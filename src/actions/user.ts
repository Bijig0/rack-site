'use server';

import { db } from '@/lib/db';
import { user, account } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getSession } from '@/lib/auth';
import { getPresignedReadUrl, isStorageConfigured } from '@/lib/storage';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  companyName: string | null;
  companyLogoUrl: string | null;
  createdAt: Date;
};

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
 * Helper to convert stored key/URL to presigned URL
 */
async function getLogoPresignedUrl(stored: string | null): Promise<string | null> {
  if (!stored || !isStorageConfigured()) {
    return stored;
  }

  // Extract key from stored value (could be a key or legacy URL)
  let key = stored;
  if (stored.startsWith('http')) {
    // Handle legacy URLs - extract key
    const railwayMatch = stored.match(/\.storage\.railway\.app\/(.+?)(?:\?|$)/);
    if (railwayMatch) {
      key = railwayMatch[1];
    } else {
      const pathMatch = stored.match(/storage\.railway\.app\/[^/]+\/(.+?)(?:\?|$)/);
      if (pathMatch) {
        key = pathMatch[1];
      } else {
        // Can't extract key, return as-is
        return stored;
      }
    }
  }

  try {
    // Generate presigned URL (7 days expiry)
    return await getPresignedReadUrl(key, 604800);
  } catch (error) {
    console.error('[getLogoPresignedUrl] Failed to generate presigned URL:', error);
    return null;
  }
}

/**
 * Fetch user profile from database
 */
async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      companyName: user.companyName,
      companyLogoUrl: user.companyLogoUrl,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!users[0]) return null;

  // Generate presigned URL for company logo if it exists
  const profile = users[0];
  if (profile.companyLogoUrl) {
    profile.companyLogoUrl = await getLogoPresignedUrl(profile.companyLogoUrl);
  }

  return profile;
}

/**
 * Persistent cache for user profile (60 second TTL)
 */
const getCachedUserProfile = unstable_cache(
  async (userId: string) => fetchUserProfile(userId),
  ['user-profile'],
  {
    revalidate: 60,
    tags: ['user-profile']
  }
);

/**
 * Request-level deduplication for user profile
 */
const getRequestCachedUserProfile = cache(async (userId: string) => {
  return getCachedUserProfile(userId);
});

/**
 * Get user profile - cached at both request and persistent levels
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const userId = await getAuthenticatedUserId();
  return getRequestCachedUserProfile(userId);
}

/**
 * Update user name
 */
export async function updateUserName(newName: string) {
  const userId = await getAuthenticatedUserId();

  if (!newName || newName.trim().length === 0) {
    return { success: false, error: 'Name is required' };
  }

  try {
    await db
      .update(user)
      .set({
        name: newName.trim(),
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, userId));

    revalidateTag('user-profile');
    return { success: true };
  } catch (error) {
    console.error('[updateUserName]', error);
    return { success: false, error: 'Failed to update name' };
  }
}

/**
 * Update user email
 */
export async function updateUserEmail(newEmail: string) {
  const userId = await getAuthenticatedUserId();

  if (!newEmail || !newEmail.includes('@')) {
    return { success: false, error: 'Valid email is required' };
  }

  try {
    // Check if email is already taken
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, newEmail.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== userId) {
      return { success: false, error: 'Email is already in use' };
    }

    await db
      .update(user)
      .set({
        email: newEmail.toLowerCase(),
        emailVerified: false, // Reset verification when email changes
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, userId));

    revalidateTag('user-profile');
    return { success: true };
  } catch (error) {
    console.error('[updateUserEmail]', error);
    return { success: false, error: 'Failed to update email' };
  }
}

/**
 * Update company name
 */
export async function updateCompanyName(newCompanyName: string | null) {
  const userId = await getAuthenticatedUserId();

  try {
    await db
      .update(user)
      .set({
        companyName: newCompanyName?.trim() || null,
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, userId));

    revalidateTag('user-profile');
    return { success: true };
  } catch (error) {
    console.error('[updateCompanyName]', error);
    return { success: false, error: 'Failed to update company name' };
  }
}

/**
 * Update company logo URL
 */
export async function updateCompanyLogoUrl(logoUrl: string | null) {
  const userId = await getAuthenticatedUserId();

  try {
    await db
      .update(user)
      .set({
        companyLogoUrl: logoUrl || null,
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, userId));

    revalidateTag('user-profile');
    return { success: true };
  } catch (error) {
    console.error('[updateCompanyLogoUrl]', error);
    return { success: false, error: 'Failed to update company logo' };
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
) {
  const userId = await getAuthenticatedUserId();

  if (!currentPassword || !newPassword) {
    return { success: false, error: 'Current and new password are required' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters' };
  }

  try {
    // Get the user's credential account (password stored in account table for BetterAuth)
    const accounts = await db
      .select({
        id: account.id,
        password: account.password,
      })
      .from(account)
      .where(
        and(
          eq(account.userId, userId),
          eq(account.providerId, 'credential')
        )
      )
      .limit(1);

    if (accounts.length === 0 || !accounts[0].password) {
      return { success: false, error: 'Account not found' };
    }

    // Verify current password
    const isValid = await compare(currentPassword, accounts[0].password);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password
    await db
      .update(account)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      } as any)
      .where(eq(account.id, accounts[0].id));

    return { success: true };
  } catch (error) {
    console.error('[changeUserPassword]', error);
    return { success: false, error: 'Failed to change password' };
  }
}
