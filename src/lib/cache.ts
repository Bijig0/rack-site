import { unstable_cache } from 'next/cache';
import { cache } from 'react';

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Cache key prefix for namespacing */
  keyParts: string[];
  /** Tags for cache invalidation */
  tags?: string[];
  /** Revalidation time in seconds (default: 60) */
  revalidate?: number;
}

/**
 * Creates a dual-layer cached function with both:
 * - `unstable_cache`: Persistent data cache (survives across requests)
 * - `cache()`: Request-level deduplication (prevents duplicate calls in same render)
 *
 * @example
 * ```ts
 * // In your actions file:
 * const getUser = createCachedFetcher(
 *   async (userId: string) => db.query.users.findFirst({ where: eq(users.id, userId) }),
 *   { keyParts: ['user'], tags: ['user-profile'], revalidate: 60 }
 * );
 *
 * // Usage:
 * const user = await getUser(userId);
 * ```
 */
export function createCachedFetcher<TArgs extends unknown[], TResult>(
  fetcher: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions
): (...args: TArgs) => Promise<TResult> {
  const { keyParts, tags = [], revalidate = 60 } = options;

  // Layer 1: Persistent cache (survives across requests, invalidated by tags)
  const persistentCached = unstable_cache(
    fetcher,
    keyParts,
    { revalidate, tags }
  );

  // Layer 2: Request-level deduplication (prevents multiple calls in same render tree)
  const requestCached = cache((...args: TArgs) => persistentCached(...args));

  return requestCached;
}

/**
 * Preload helper - triggers a fetch without awaiting (fire-and-forget cache warming)
 *
 * @example
 * ```ts
 * // In layout or page:
 * preload(getUserProfile, userId);
 * preload(getUserProperties, userId);
 * ```
 */
export function preload<TArgs extends unknown[], TResult>(
  fetcher: (...args: TArgs) => Promise<TResult>,
  ...args: TArgs
): void {
  void fetcher(...args);
}

/**
 * Batch preload helper - preloads multiple items in parallel
 *
 * @example
 * ```ts
 * // Preload all property details:
 * batchPreload(getPropertyById, propertyIds);
 * ```
 */
export function batchPreload<TArg, TResult>(
  fetcher: (arg: TArg) => Promise<TResult>,
  args: TArg[]
): void {
  args.forEach(arg => void fetcher(arg));
}
