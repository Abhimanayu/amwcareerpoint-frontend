import { MetadataRoute } from 'next';
import { SEO_ROBOTS_BLOCK } from '@/lib/seoHold';

export default function robots(): MetadataRoute.Robots {
  if (SEO_ROBOTS_BLOCK) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  };
}
