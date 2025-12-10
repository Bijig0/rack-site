import { getUserProperties, getUserPropertyCount, getPropertyById, getAllPropertyIds } from '@/actions/properties';
import { getUserAppraisalReports } from '@/actions/appraisals';

/**
 * Preload properties data - call this early to warm the cache
 * This triggers the fetch without blocking rendering
 */
export function preloadProperties() {
  void getUserProperties();
  void getUserPropertyCount();
}

/**
 * Preload appraisal reports data
 */
export function preloadAppraisalReports() {
  void getUserAppraisalReports();
}

/**
 * Preload a single property by ID
 */
export function preloadPropertyById(propertyId: string) {
  void getPropertyById(propertyId);
}

/**
 * Preload all property details for the current user
 * This fetches all properties and then preloads each property's details
 */
export async function preloadAllPropertyDetails() {
  try {
    const propertyIds = await getAllPropertyIds();
    // Preload each property's details in parallel (fire and forget)
    propertyIds.forEach(id => {
      void getPropertyById(id);
    });
  } catch (error) {
    // Silently fail - this is just cache warming
    console.error('Error preloading property details:', error);
  }
}

/**
 * Preload dashboard data - properties and appraisal reports
 */
export function preloadDashboardData() {
  void getUserProperties();
  void getUserPropertyCount();
  void getUserAppraisalReports();
}
