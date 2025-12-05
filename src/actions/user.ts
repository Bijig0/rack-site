'use server';

import { db } from '@/db/drizzle';
import { user, account } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { revalidateTag } from 'next/cache';

// For now, use a hardcoded user ID until auth is fully integrated
const DEFAULT_USER_ID = 'agent-user-001';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
};

/**
 * Get user profile
 */
export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  const targetUserId = userId || DEFAULT_USER_ID;

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, targetUserId))
    .limit(1);

  return users[0] || null;
}

/**
 * Update user name
 */
export async function updateUserName(newName: string, userId?: string) {
  const targetUserId = userId || DEFAULT_USER_ID;

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
      .where(eq(user.id, targetUserId));

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
export async function updateUserEmail(newEmail: string, userId?: string) {
  const targetUserId = userId || DEFAULT_USER_ID;

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

    if (existingUser.length > 0 && existingUser[0].id !== targetUserId) {
      return { success: false, error: 'Email is already in use' };
    }

    await db
      .update(user)
      .set({
        email: newEmail.toLowerCase(),
        emailVerified: false, // Reset verification when email changes
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, targetUserId));

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
  newPassword: string,
  userId?: string
) {
  const targetUserId = userId || DEFAULT_USER_ID;

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
          eq(account.userId, targetUserId),
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
