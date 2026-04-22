import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUniversityBySlug, getUniversities } from '@/lib/universities';
import { getCountryBySlug } from '@/lib/countries';
import { extractCollectionData, pickUniversityImageSource, resolveMediaUrl } from '@/lib/utils';
import UniversityDetailClient from './UniversityDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  try {
    const res = await getUniversityBySlug(slug);
    const university = res.data || res;
    if (!university) return { title: 'University Not Found' };
    const title = university.seo?.metaTitle || `${university.name} - MBBS Admission`;
    const description = university.seo?.metaDescription || `Study MBBS at ${university.name}. ${university.description || ''} Get complete admission details, fees, and eligibility.`;
    const ogImage = resolveMediaUrl(pickUniversityImageSource(university));
    const canonical = university.seo?.canonicalUrl || `${siteUrl}/universities/${slug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, type: 'article', images: ogImage ? [{ url: ogImage }] : undefined },
    };
  } catch {
    return { title: 'University Not Found' };
  }
}

export default async function UniversityDetailPage({ params }: Props) {
  const { slug } = await params;
  let university: any = null;
  let countryData: any = null;
  let relatedUniversities: any[] = [];

  try {
    const res = await getUniversityBySlug(slug);
    university = res.data || res;
  } catch { /* not found */ }

  if (!university) notFound();

  // Build schema markup
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  let schemaJsonLd: object | null = null;
  if (university.seo?.schemaMarkup) {
    try { schemaJsonLd = JSON.parse(university.seo.schemaMarkup); } catch { /* invalid JSON */ }
  }
  if (!schemaJsonLd) {
    schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: university.name || '',
      description: university.description || '',
      url: `${siteUrl}/universities/${slug}`,
      image: resolveMediaUrl(pickUniversityImageSource(university)) || undefined,
      address: university.country?.name ? { '@type': 'PostalAddress', addressCountry: university.country.name } : undefined,
    };
  }

  // Fetch country data for admission process
  try {
    if (university.country?.slug) {
      const cRes = await getCountryBySlug(university.country.slug);
      countryData = cRes.data || cRes;
    }
  } catch { /* ok */ }

  // Fetch related universities from same country
  try {
    if (university.country?._id) {
      const uRes = await getUniversities({ country: university.country._id, limit: 6 });
      const all = extractCollectionData<any>(uRes, ['universities']);
      relatedUniversities = all.filter((u: any) => u._id !== university._id).slice(0, 3);
    }
  } catch { /* ok */ }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <UniversityDetailClient
        university={university}
        countryData={countryData}
        relatedUniversities={relatedUniversities}
      />
    </>
  );
}