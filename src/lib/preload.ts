import { getUserProperties, getUserPropertyCount, getPropertyById, getAllPropertyIds } from '@/actions/properties';
import { getUserAppraisalReports } from '@/actions/appraisals';
import { getUserProfile } from '@/actions/user';
import { preload, batchPreload } from './cache';

/**
 * Preload properties data - call this early to warm the cache
 * This triggers the fetch without blocking rendering
 */
export function preloadProperties() {
  preload(getUserProperties);
  preload(getUserPropertyCount);
}

/**
 * Preload appraisal reports data
 */
export function preloadAppraisalReports() {
  preload(getUserAppraisalReports);
}

/**
 * Preload a single property by ID
 */
export function preloadPropertyById(propertyId: string) {
  preload(getPropertyById, propertyId);
}

/**
 * Preload multiple property details in parallel
 */
export function preloadPropertyDetails(propertyIds: string[]) {
  batchPreload(getPropertyById, propertyIds);
}

/**
 * Preload all property details for the current user
 * This fetches all properties and then preloads each property's details
 */
export async function preloadAllPropertyDetails() {
  try {
    const propertyIds = await getAllPropertyIds();
    batchPreload(getPropertyById, propertyIds);
  } catch (error) {
    // Silently fail - this is just cache warming
    console.error('Error preloading property details:', error);
  }
}

/**
 * Preload dashboard data - properties, appraisal reports, and user profile
 */
export function preloadDashboardData() {
  preload(getUserProperties);
  preload(getUserPropertyCount);
  preload(getUserAppraisalReports);
  preload(getUserProfile);
}
