import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rack.com.au';

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
