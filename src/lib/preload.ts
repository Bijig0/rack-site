import { getUserProperties, getUserPropertyCount } from '@/actions/properties';

/**
 * Preload properties data - call this early to warm the cache
 * This triggers the fetch without blocking rendering
 */
export function preloadProperties() {
  void getUserProperties();
  void getUserPropertyCount();
}
