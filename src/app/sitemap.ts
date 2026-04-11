import { MetadataRoute } from 'next';
import { getCountries } from '@/lib/countries';
import { getUniversities } from '@/lib/universities';
import { getBlogs } from '@/lib/blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/countries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/universities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  let countryPages: MetadataRoute.Sitemap = [];
  let universityPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const res = await getCountries({ limit: 100 });
    const countries = Array.isArray(res.data) ? res.data : [];
    countryPages = countries.map((c: { slug: string; updatedAt?: string }) => ({
      url: `${siteUrl}/countries/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch { /* API unavailable */ }

  try {
    const res = await getUniversities({ limit: 200 });
    const universities = Array.isArray(res.data) ? res.data : [];
    universityPages = universities.map((u: { slug: string; updatedAt?: string }) => ({
      url: `${siteUrl}/universities/${u.slug}`,
      lastModified: u.updatedAt ? new Date(u.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch { /* API unavailable */ }

  try {
    const res = await getBlogs({ limit: 200 });
    const blogs = Array.isArray(res.data) ? res.data : [];
    blogPages = blogs.map((b: { slug: string; updatedAt?: string }) => ({
      url: `${siteUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch { /* API unavailable */ }

  return [...staticPages, ...countryPages, ...universityPages, ...blogPages];
}
