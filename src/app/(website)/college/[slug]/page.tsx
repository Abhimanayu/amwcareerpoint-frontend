import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUniversityBySlug, getUniversities } from '@/lib/universities';
import { getCountryBySlug } from '@/lib/countries';
import { clampSeoDescription, extractCollectionData, pickUniversityImageSource, resolveCanonicalUrl, resolveMediaUrl, serializeJsonLd } from '@/lib/utils';
import { getPublicFaqs } from '@/lib/server/faqs';
import { SEO_HOLD } from '@/lib/seoHold';
import UniversityDetailClient from '../../universities/[slug]/UniversityDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// Keep detail pages fresh after admin edits (curriculum, fees, seo, etc.)
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (SEO_HOLD) {
    return {
      title: 'AMW Career Point',
      description: 'AMW Career Point official website.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  try {
    const res = await getUniversityBySlug(slug);
    const university = res.data || res;
    if (!university) return { title: 'University Not Found' };
    const title = university.seo?.metaTitle || `${university.name} - MBBS Admission`;
    const description = clampSeoDescription(
      university.seo?.metaDescription || university.description,
      `Study MBBS at ${university.name}. Get complete admission details, fees, eligibility, and counselling support.`
    );
    const ogImage = resolveMediaUrl(pickUniversityImageSource(university));
    const canonical = resolveCanonicalUrl(university.seo?.canonicalUrl, `${siteUrl}/college/${slug}`);
    return {
      title: {
        absolute: title,
      },
      description,
      alternates: { canonical },
      openGraph: { title, description, type: 'article', url: canonical, images: ogImage ? [{ url: ogImage }] : undefined },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return { title: 'University Not Found' };
  }
}

export default async function CollegeDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  let university: any = null;
  let countryData: any = null;
  let relatedUniversities: any[] = [];

  try {
    const res = await getUniversityBySlug(slug);
    university = res.data || res;
  } catch { /* not found */ }

  if (!university) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  let schemaJsonLd: object | null = null;
  if (university.seo?.schemaMarkup) {
    try { schemaJsonLd = JSON.parse(university.seo.schemaMarkup); } catch { /* invalid JSON */ }
  }
  schemaJsonLd ??= {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: university.name || '',
      description: clampSeoDescription(university.description, `Study MBBS at ${university.name} with AMW Career Point.`),
      url: `${siteUrl}/college/${slug}`,
      image: resolveMediaUrl(pickUniversityImageSource(university)) || undefined,
      address: university.country?.name ? { '@type': 'PostalAddress', addressCountry: university.country.name } : undefined,
    };
  const breadcrumbSchemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Colleges',
        item: `${siteUrl}/college`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: university.name || 'University',
        item: `${siteUrl}/college/${slug}`,
      },
    ],
  };

  const [countryResult, relatedResult, apiFaqs] = await Promise.all([
    university.country?.slug
      ? getCountryBySlug(university.country.slug).then((r) => r.data || r).catch(() => null)
      : null,
    university.country?._id
      ? getUniversities({ country: university.country._id, limit: 6, sort: 'sortOrder' })
          .then((r) => {
            const all = extractCollectionData<any>(r, ['universities']);
            return all.filter((u: any) => u._id !== university._id).slice(0, 3);
          })
          .catch(() => [])
      : [],
    getPublicFaqs('university', { pageSlug: slug }).catch(() => []),
  ]);

  countryData = countryResult;
  relatedUniversities = relatedResult;

  return (
    <>
      {!SEO_HOLD && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchemaJsonLd) }}
          />
        </>
      )}
      <UniversityDetailClient
        university={university}
        countryData={countryData}
        relatedUniversities={relatedUniversities}
        apiFaqs={apiFaqs}
      />
    </>
  );
}
