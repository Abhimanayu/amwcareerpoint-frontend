import { MetadataRoute } from "next";
import { getCountries } from "@/lib/countries";
import { getUniversities } from "@/lib/universities";
import { getBlogs } from "@/lib/blogs";
import { api } from "@/lib/api";
import { extractCollectionData } from "@/lib/utils";
import { SEO_HOLD } from "@/lib/seoHold";
import { IndiaPage, indiaPath } from "@/lib/india";
import fallback from "@/data/sitemap-fallback.json";

export const revalidate = 3600;

function normalizeSlug(slug: unknown): string | null {
  if (typeof slug !== "string") return null;
  const normalized = slug.trim().replace(/^\/+|\/+$/g, "");
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

function isSelfCanonical(
  canonicalUrl: unknown,
  defaultPath: string,
  siteUrl: string,
): boolean {
  if (typeof canonicalUrl !== "string" || canonicalUrl.trim() === "")
    return true;
  const canonical = canonicalUrl.trim().replace(/\/$/, "");
  return (
    canonical === defaultPath ||
    canonical === `${siteUrl}${defaultPath}`.replace(/\/$/, "")
  );
}

async function withCdnRetry<T>(request: () => Promise<T>): Promise<T | null> {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await request();
    } catch {
      if (attempt < 4) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  return null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (SEO_HOLD) {
    return [];
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://amwcareerpoint.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/countries`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/college`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blogs`, changeFrequency: "daily", priority: 0.9 },
  ];

  // Hostinger intermittently challenges server-originated API requests. The
  // checked-in snapshot prevents those challenges from collapsing the sitemap
  // to only its six static URLs.
  const overviewResponse = await withCdnRetry(() =>
    api.get("/india/pages/india"),
  );
  const statesResponse = await withCdnRetry(() => api.get("/india/states"));
  const countryResponse = await withCdnRetry(() =>
    getCountries({ limit: 100 }),
  );
  const universityResponse = await withCdnRetry(() =>
    getUniversities({ limit: 1000 }),
  );
  const blogResponse = await withCdnRetry(() => getBlogs({ limit: 200 }));

  const overview = (overviewResponse?.data?.data ?? null) as IndiaPage | null;
  const states = (statesResponse?.data?.data ??
    fallback.indiaPages) as IndiaPage[];
  const indiaPages: MetadataRoute.Sitemap = [
    ...(overview ? [overview] : []),
    ...states,
  ]
    .filter(
      (p) =>
        !p.seo.noindex &&
        (!p.seo.canonicalUrl ||
          p.seo.canonicalUrl === indiaPath(p) ||
          p.seo.canonicalUrl === `${siteUrl}${indiaPath(p)}`),
    )
    .map((p) => ({
      url: `${siteUrl}${indiaPath(p)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const countryPages: MetadataRoute.Sitemap = (() => {
    const res = countryResponse ?? fallback.countries;
    const countries = extractCollectionData<{
      slug?: unknown;
      updatedAt?: string;
      seo?: { noindex?: boolean; canonicalUrl?: string };
    }>(res, ["countries"]);
    return countries.reduce<MetadataRoute.Sitemap>((pages, c) => {
      const slug = normalizeSlug(c.slug);
      if (!slug) return pages;
      if (slug === "mbbs-in-india") return pages;
      const path = `/countries/${slug}`;
      if (
        c.seo?.noindex ||
        !isSelfCanonical(c.seo?.canonicalUrl, path, siteUrl)
      )
        return pages;

      pages.push({
        url: `${siteUrl}${path}`,
        ...(c.updatedAt ? { lastModified: new Date(c.updatedAt) } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });

      return pages;
    }, []);
  })();

  const universityPages: MetadataRoute.Sitemap = (() => {
    const res = universityResponse ?? fallback.universities;
    const universities = extractCollectionData<{
      slug?: unknown;
      updatedAt?: string;
      seo?: { noindex?: boolean; canonicalUrl?: string };
    }>(res, ["universities"]);
    return universities.reduce<MetadataRoute.Sitemap>((pages, u) => {
      if (u.seo?.noindex) return pages;
      const slug = normalizeSlug(u.slug);
      if (!slug) return pages;
      const path = `/college/${slug}`;
      if (!isSelfCanonical(u.seo?.canonicalUrl, path, siteUrl)) return pages;

      pages.push({
        url: `${siteUrl}${path}`,
        ...(u.updatedAt ? { lastModified: new Date(u.updatedAt) } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });

      return pages;
    }, []);
  })();

  const blogPages: MetadataRoute.Sitemap = (() => {
    const res = blogResponse ?? fallback.blogs;
    const blogs = extractCollectionData<{
      slug?: unknown;
      updatedAt?: string;
      seo?: { noindex?: boolean; canonicalUrl?: string };
    }>(res, ["blogs"]);
    return blogs.reduce<MetadataRoute.Sitemap>((pages, b) => {
      const slug = normalizeSlug(b.slug);
      if (!slug) return pages;
      const path = `/blogs/${slug}`;
      if (
        b.seo?.noindex ||
        !isSelfCanonical(b.seo?.canonicalUrl, path, siteUrl)
      )
        return pages;

      pages.push({
        url: `${siteUrl}${path}`,
        ...(b.updatedAt ? { lastModified: new Date(b.updatedAt) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });

      return pages;
    }, []);
  })();

  const fallbackPages: MetadataRoute.Sitemap = fallback.urls
    .filter((item) => {
      const path = item.url.replace(siteUrl, "");
      if (path.startsWith("/countries/")) return !countryResponse;
      if (path.startsWith("/college/")) return !universityResponse;
      if (path.startsWith("/blogs/")) return !blogResponse;
      if (path === "/mbbs-india" || path.startsWith("/mbbs-india/")) {
        return !overviewResponse || !statesResponse;
      }
      return false;
    })
    .map((item) => ({
      url: item.url,
      ...(item.lastModified
        ? { lastModified: new Date(item.lastModified) }
        : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return dedupeByUrl([
    ...staticPages,
    ...indiaPages,
    ...countryPages,
    ...universityPages,
    ...blogPages,
    ...fallbackPages,
  ]);
}
