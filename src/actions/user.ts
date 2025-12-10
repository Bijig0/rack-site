'use server';

import { db } from '@/lib/db';
import { user, account } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { revalidateTag } from 'next/cache';
import { getSession } from '@/lib/auth';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
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
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const userId = await getAuthenticatedUserId();

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return users[0] || null;
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
