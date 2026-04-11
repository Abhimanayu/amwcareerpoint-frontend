import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUniversityBySlug, getUniversities } from '@/lib/universities';
import { getCountryBySlug } from '@/lib/countries';
import UniversityDetailClient from './UniversityDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getUniversityBySlug(slug);
    const university = res.data || res;
    if (!university) return { title: 'University Not Found' };
    const title = university.seo?.metaTitle || `${university.name} - MBBS Admission`;
    const description = university.seo?.metaDescription || `Study MBBS at ${university.name}. ${university.description || ''} Get complete admission details, fees, and eligibility.`;
    return {
      title,
      description,
      openGraph: { title, description, type: 'article', images: university.heroImage ? [{ url: university.heroImage }] : undefined },
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
      const all = Array.isArray(uRes.data) ? uRes.data : [];
      relatedUniversities = all.filter((u: any) => u._id !== university._id).slice(0, 3);
    }
  } catch { /* ok */ }

  return (
    <UniversityDetailClient
      university={university}
      countryData={countryData}
      relatedUniversities={relatedUniversities}
    />
  );
}