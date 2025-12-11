import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { env, isProduction } from '@/lib/config';

export const sanityConfig = {
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: isProduction(),
};

export const sanityClient = createClient({
  ...sanityConfig,
  perspective: 'published',
});

// Preview client for draft content
export const previewClient = createClient({
  ...sanityConfig,
  useCdn: false,
  perspective: 'previewDrafts',
  token: env.SANITY_API_TOKEN,
});

// Get the appropriate client based on preview mode
export const getClient = (preview = false) => (preview ? previewClient : sanityClient);

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
