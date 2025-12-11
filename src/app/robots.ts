import { MetadataRoute } from 'next';
import { env } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/login',
          '/register',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
