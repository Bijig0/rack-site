import { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity/client';
import { env } from '@/lib/config';

interface SanityPost {
  slug: { current: string };
  _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch dynamic blog posts from Sanity
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanityClient.fetch<SanityPost[]>(
      `*[_type == "post" && !(_id in path("drafts.**"))]{slug, _updatedAt}`
    );
    blogPages = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug.current}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...blogPages];
}
