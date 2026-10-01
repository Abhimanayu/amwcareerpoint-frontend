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

function isSelfCanonical(canonicalUrl: unknown, defaultPath: string, siteUrl: string): boolean {
  if (typeof canonicalUrl !== 'string' || canonicalUrl.trim() === '') return true;
  const canonical = canonicalUrl.trim().replace(/\/$/, '');
  return canonical === defaultPath || canonical === `${siteUrl}${defaultPath}`.replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (SEO_HOLD) {
    return [];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/countries`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/college`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/blogs`, changeFrequency: 'daily', priority: 0.9 },
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
    const countries = extractCollectionData<{ slug?: unknown; updatedAt?: string; seo?: { noindex?: boolean; canonicalUrl?: string } }>(res, ['countries']);
    countryPages = countries.reduce<MetadataRoute.Sitemap>((pages, c) => {
        const slug = normalizeSlug(c.slug);
        if (!slug) return pages;
        if (slug === 'mbbs-in-india') return pages;
        const path = `/countries/${slug}`;
        if (c.seo?.noindex || !isSelfCanonical(c.seo?.canonicalUrl, path, siteUrl)) return pages;

        pages.push({
          url: `${siteUrl}${path}`,
          ...(c.updatedAt ? { lastModified: new Date(c.updatedAt) } : {}),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });

        return pages;
      }, []);
  } catch { /* API unavailable */ }

  try {
    const res = await getUniversities({ limit: 1000 });
    const universities = extractCollectionData<{ slug?: unknown; updatedAt?: string; seo?: { noindex?: boolean; canonicalUrl?: string } }>(res, ['universities']);
    universityPages = universities.reduce<MetadataRoute.Sitemap>((pages, u) => {
        if (u.seo?.noindex) return pages;
        const slug = normalizeSlug(u.slug);
        if (!slug) return pages;
        const path = `/college/${slug}`;
        if (!isSelfCanonical(u.seo?.canonicalUrl, path, siteUrl)) return pages;

        pages.push({
          url: `${siteUrl}${path}`,
          ...(u.updatedAt ? { lastModified: new Date(u.updatedAt) } : {}),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });

        return pages;
      }, []);
  } catch { /* API unavailable */ }

  try {
    const res = await getBlogs({ limit: 200 });
    const blogs = extractCollectionData<{ slug?: unknown; updatedAt?: string; seo?: { noindex?: boolean; canonicalUrl?: string } }>(res, ['blogs']);
    blogPages = blogs.reduce<MetadataRoute.Sitemap>((pages, b) => {
        const slug = normalizeSlug(b.slug);
        if (!slug) return pages;
        const path = `/blogs/${slug}`;
        if (b.seo?.noindex || !isSelfCanonical(b.seo?.canonicalUrl, path, siteUrl)) return pages;

        pages.push({
          url: `${siteUrl}${path}`,
          ...(b.updatedAt ? { lastModified: new Date(b.updatedAt) } : {}),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        });

        return pages;
      }, []);
  } catch { /* API unavailable */ }

  return dedupeByUrl([...staticPages, ...indiaPages, ...countryPages, ...universityPages, ...blogPages]);
}
