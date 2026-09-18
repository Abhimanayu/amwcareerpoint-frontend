import { MetadataRoute } from 'next';
import { getCountries } from '@/lib/countries';
import { getUniversities } from '@/lib/universities';
import { getBlogs } from '@/lib/blogs';
import { extractCollectionData } from '@/lib/utils';
import { SEO_HOLD } from '@/lib/seoHold';
import { readIndiaPage, readIndiaStates } from '@/lib/server/india';
import { indiaPath } from '@/lib/india';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeSlug(slug: unknown): string | null {
  if (typeof slug !== 'string') return null;
  const normalized = slug.trim().replace(/^\/+|\/+$/g, '');
  return normalized.length > 0 ? normalized : null;
}

function dedupeByUrl(items: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const deduped: MetadataRoute.Sitemap = [];

  for (const item of items) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    deduped.push(item);
  }

  return deduped;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (SEO_HOLD) {
    return [];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/countries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/college`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  let countryPages: MetadataRoute.Sitemap = [];
  let universityPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  let indiaPages: MetadataRoute.Sitemap = [];
  try {
    const [overview, states] = await Promise.all([readIndiaPage('india'), readIndiaStates()]);
    indiaPages = [...(overview ? [overview] : []), ...states].filter(p => !p.seo.noindex && (!p.seo.canonicalUrl || p.seo.canonicalUrl === indiaPath(p) || p.seo.canonicalUrl === `${siteUrl}${indiaPath(p)}`)).map(p => ({ url: `${siteUrl}${indiaPath(p)}`, lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined, changeFrequency: 'weekly', priority: 0.8 }));
  } catch { /* Existing sitemap remains available during a module API outage. */ }

  try {
    const res = await getCountries({ limit: 100 });
    const countries = extractCollectionData<{ slug?: unknown; updatedAt?: string }>(res, ['countries']);
    countryPages = countries.reduce<MetadataRoute.Sitemap>((pages, c) => {
        const slug = normalizeSlug(c.slug);
        if (!slug) return pages;
        if (slug === 'mbbs-in-india') return pages;

        pages.push({
          url: `${siteUrl}/countries/${slug}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });

        return pages;
      }, []);
  } catch { /* API unavailable */ }

  try {
    const res = await getUniversities({ limit: 1000 });
    const universities = extractCollectionData<{ slug?: unknown; updatedAt?: string; seo?: { noindex?: boolean } }>(res, ['universities']);
    universityPages = universities.reduce<MetadataRoute.Sitemap>((pages, u) => {
        if (u.seo?.noindex) return pages;
        const slug = normalizeSlug(u.slug);
        if (!slug) return pages;

        pages.push({
          url: `${siteUrl}/college/${slug}`,
          lastModified: u.updatedAt ? new Date(u.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });

        return pages;
      }, []);
  } catch { /* API unavailable */ }

  try {
    const res = await getBlogs({ limit: 200 });
    const blogs = extractCollectionData<{ slug?: unknown; updatedAt?: string }>(res, ['blogs']);
    blogPages = blogs.reduce<MetadataRoute.Sitemap>((pages, b) => {
        const slug = normalizeSlug(b.slug);
        if (!slug) return pages;

        pages.push({
          url: `${siteUrl}/blogs/${slug}`,
          lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        });

        return pages;
      }, []);
  } catch { /* API unavailable */ }

  return dedupeByUrl([...staticPages, ...indiaPages, ...countryPages, ...universityPages, ...blogPages]);
}
