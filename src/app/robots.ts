import { MetadataRoute } from 'next';
import { SEO_ROBOTS_BLOCK } from '@/lib/seoHold';

export default function robots(): MetadataRoute.Robots {
  if (SEO_ROBOTS_BLOCK) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/',
        },
      ],
    };
  }


  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
