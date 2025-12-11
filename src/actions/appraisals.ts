'use server';

import { db } from '@/db/drizzle';
import { appraisal, property } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getSession } from '@/lib/auth';

async function getAuthenticatedUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Not authenticated');
  }
  return session.userId;
}

export type AppraisalReportData = {
  id: string;
  propertyId: string;
  addressCommonName: string;
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  status: string;
  pdfUrl: string | null;
  createdAt: Date;
};

async function fetchUserAppraisalReports(userId: string): Promise<AppraisalReportData[]> {
  // Join appraisals with properties to get address info
  const results = await db
    .select({
      id: appraisal.id,
      propertyId: appraisal.propertyId,
      addressCommonName: property.addressCommonName,
      bedroomCount: property.bedroomCount,
      bathroomCount: property.bathroomCount,
      propertyType: property.propertyType,
      status: appraisal.status,
      pdfUrl: appraisal.pdfUrl,
      createdAt: appraisal.createdAt,
    })
    .from(appraisal)
    .innerJoin(property, eq(appraisal.propertyId, property.id))
    .where(eq(property.userId, userId))
    .orderBy(desc(appraisal.createdAt));

  return results;
}

const getCachedUserAppraisalReports = unstable_cache(
  async (userId: string) => fetchUserAppraisalReports(userId),
  ['user-appraisal-reports'],
  {
    revalidate: 60,
    tags: ['appraisals', 'properties']
  }
);

const getRequestCachedAppraisalReports = cache(async (userId: string) => {
  return getCachedUserAppraisalReports(userId);
});

/**
 * Get all appraisal reports for the authenticated user, ordered by latest created
 */
export async function getUserAppraisalReports(): Promise<AppraisalReportData[]> {
  const userId = await getAuthenticatedUserId();
  return getRequestCachedAppraisalReports(userId);
}

/**
 * Get completed appraisal reports count
 */
export async function getCompletedAppraisalCount(): Promise<number> {
  const userId = await getAuthenticatedUserId();
  const reports = await getRequestCachedAppraisalReports(userId);
  return reports.filter(r => r.status === 'completed').length;
}

/**
 * Delete an appraisal report (must belong to the authenticated user)
 */
export async function deleteAppraisal(appraisalId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();

    // Verify the appraisal belongs to the user by checking the property ownership
    const appraisalRecord = await db
      .select({
        id: appraisal.id,
        propertyId: appraisal.propertyId,
        userId: property.userId,
      })
      .from(appraisal)
      .innerJoin(property, eq(appraisal.propertyId, property.id))
      .where(eq(appraisal.id, appraisalId))
      .limit(1);

    if (appraisalRecord.length === 0) {
      return { success: false, error: 'Appraisal not found' };
    }

    if (appraisalRecord[0].userId !== userId) {
      return { success: false, error: 'Not authorized to delete this appraisal' };
    }

    // Get the property ID for path revalidation
    const propertyId = appraisalRecord[0].propertyId;

    // Delete the appraisal
    await db.delete(appraisal).where(eq(appraisal.id, appraisalId));

    // Revalidate cache
    const { revalidateTag, revalidatePath } = await import('next/cache');
    revalidateTag('appraisals');
    revalidateTag('properties');
    // Also revalidate the specific property page path
    revalidatePath(`/dashboard/my-properties/${propertyId}`);
    revalidatePath('/dashboard/appraisal-reports');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting appraisal:', error);
    return { success: false, error: 'Failed to delete appraisal' };
  }
}
