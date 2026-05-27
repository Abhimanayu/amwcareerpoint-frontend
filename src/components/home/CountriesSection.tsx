'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';
import { SafeImage } from '@/components/ui/SafeImage';
import { getCountries } from '@/lib/countries';
import type { HomeCuratedCountry } from '@/lib/homeSettings';
import { extractCollectionData, stripHtml } from '@/lib/utils';
import { getCountrySlugFromObject } from '@/lib/slugUtils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const fallbackCountries = [
  { name: 'Russia', slug: 'russia', code: 'ru', unis: '50+', fees: '₹2.5L – 6L', dur: '6 Yrs', highlights: ['No IELTS', 'WHO Approved', 'Low Cost'] },
  { name: 'Ukraine', slug: 'ukraine', code: 'ua', unis: '30+', fees: '₹3L – 5L', dur: '6 Yrs', highlights: ['English Medium', 'EU Recognition', 'Quality Edu'] },
  { name: 'Kazakhstan', slug: 'kazakhstan', code: 'kz', unis: '25+', fees: '₹3.5L – 7L', dur: '6 Yrs', highlights: ['Advanced Infra', 'Safe', 'Cultural Similarity'] },
  { name: 'Georgia', slug: 'georgia', code: 'ge', unis: '15+', fees: '₹4L – 8L', dur: '6 Yrs', highlights: ['European Std', 'Modern', 'English Teaching'] },
  { name: 'Kyrgyzstan', slug: 'kyrgyzstan', code: 'kg', unis: '20+', fees: '₹2L – 4L', dur: '6 Yrs', highlights: ['Most Affordable', 'Indian Food', 'Easy Admission'] },
  { name: 'Philippines', slug: 'philippines', code: 'ph', unis: '18+', fees: '₹3L – 6L', dur: '4 Yrs', highlights: ['English Speaking', 'US Curriculum', 'USMLE Prep'] },
];

const COUNTRY_HERO_FALLBACKS = [
  '/universities/moscow.jpg',
  '/universities/tashkent.jpg',
  '/universities/astana.jpg',
  '/universities/kyrgyz.jpg',
  '/universities/china.jpg',
  '/universities/aiims.jpg',
] as const;

function getStableCountryFallbackImage(country: { slug?: string; name?: string }) {
  const seed = `${country.slug || ''}|${country.name || ''}`.trim();
  if (!seed) return COUNTRY_HERO_FALLBACKS[0];

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return COUNTRY_HERO_FALLBACKS[hash % COUNTRY_HERO_FALLBACKS.length];
}

function getCountryImageAlt(country: Record<string, unknown>, imageSource?: string) {
  const name = typeof country.name === 'string' && country.name.trim() ? country.name.trim() : 'Country';
  if (imageSource === country.heroImage) {
    return (country.heroImageAlt as string) || `${name} MBBS study destination`;
  }
  if (imageSource === country.cardImage) {
    return (country.cardImageAlt as string) || `${name} MBBS country card`;
  }
  if (imageSource === country.flagImage) {
    return (country.flagImageAlt as string) || `${name} flag`;
  }

  return `${name} MBBS study destination`;
}

type CountriesSectionProps = {
  readonly items?: readonly HomeCuratedCountry[];
};

function readCountryTotal(payload: unknown, fallbackCount: number) {
  if (!payload || typeof payload !== 'object') {
    return fallbackCount;
  }

  const root = payload as Record<string, unknown>;
  const data = typeof root.data === 'object' && root.data !== null ? root.data as Record<string, unknown> : null;
  const pagination = typeof root.pagination === 'object' && root.pagination !== null ? root.pagination as Record<string, unknown> : null;
  const nestedPagination = typeof data?.pagination === 'object' && data.pagination !== null ? data.pagination as Record<string, unknown> : null;

  const candidates = [
    root.total,
    root.totalCount,
    root.count,
    pagination?.total,
    pagination?.totalCount,
    data?.total,
    data?.totalCount,
    data?.count,
    nestedPagination?.total,
    nestedPagination?.totalCount,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }
  }

  return fallbackCount;
}

export function CountriesSection({ items }: CountriesSectionProps) {
  const curatedCount = items?.length ?? 0;
  const curatedCountries = items ?? [];
  const [fetchedCountries, setFetchedCountries] = useState<any[]>([]);
  const [usingFetchedFallback, setUsingFetchedFallback] = useState(false);
  const [fetchedTotalCountries, setFetchedTotalCountries] = useState(Math.max(fallbackCountries.length, curatedCount));

  const isMeaningfulValue = (value: unknown) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined;
  };

  const mergeCountryRecords = (existing: any, incoming: any) => {
    const merged = { ...incoming, ...existing };

    const enrichKeys = [
      'heroImage',
      'cardImage',
      'flagImage',
      'description',
      'highlights',
      'feeRange',
      'annualFeeRange',
      'duration',
      'tagline',
    ];

    for (const key of enrichKeys) {
      if (!isMeaningfulValue(merged[key]) && isMeaningfulValue(incoming[key])) {
        merged[key] = incoming[key];
      }
    }

    return merged;
  };

  const dedupeCountries = (entries: any[]) => {
    const unique: any[] = [];

    for (const country of entries) {
      if (!country || typeof country !== 'object') continue;

      const idKey = typeof country._id === 'string' && country._id.trim() ? `id:${country._id}` : '';
      const slugKey = typeof country.slug === 'string' && country.slug.trim() ? `slug:${country.slug.toLowerCase()}` : '';
      const nameKey = typeof country.name === 'string' && country.name.trim() ? `name:${country.name.toLowerCase()}` : '';
      const keys = [idKey, slugKey, nameKey].filter(Boolean);

      if (keys.length === 0) continue;

      const existingIndex = unique.findIndex((item) => {
        const existingIdKey = typeof item?._id === 'string' && item._id.trim() ? `id:${item._id}` : '';
        const existingSlugKey = typeof item?.slug === 'string' && item.slug.trim() ? `slug:${item.slug.toLowerCase()}` : '';
        const existingNameKey = typeof item?.name === 'string' && item.name.trim() ? `name:${item.name.toLowerCase()}` : '';
        const existingKeys = [existingIdKey, existingSlugKey, existingNameKey].filter(Boolean);
        return keys.some((key) => existingKeys.includes(key));
      });

      if (existingIndex === -1) {
        unique.push(country);
      } else {
        unique[existingIndex] = mergeCountryRecords(unique[existingIndex], country);
      }
    }

    return unique;
  };

  useEffect(() => {
    // Keep this above current production count, but avoid unnecessarily heavy homepage API payloads.
    getCountries({ limit: 32 })
      .then((res) => {
        const apiCountries = extractCollectionData<any>(res, ['countries']);
        setFetchedCountries(apiCountries);
        setUsingFetchedFallback(false);
        const total = readCountryTotal(res, apiCountries.length);
        setFetchedTotalCountries(Math.max(total, curatedCount, apiCountries.length, fallbackCountries.length));
      })
      .catch(() => {
        setFetchedCountries([]);
        setUsingFetchedFallback(true);
        setFetchedTotalCountries(Math.max(fallbackCountries.length, curatedCount));
      });

  }, [curatedCount]);

  const mergedCountries = dedupeCountries([...curatedCountries, ...fetchedCountries]);
  const countries = mergedCountries.length > 0
    ? mergedCountries
    : curatedCountries.length > 0
      ? curatedCountries
      : usingFetchedFallback
        ? fallbackCountries
        : fallbackCountries;
  const usingFallback = countries === fallbackCountries;
  const totalCountries = Math.max(fetchedTotalCountries, countries.length);
  const countLabel = totalCountries;
  const countNoun = countLabel === 1 ? 'Country' : 'Countries';

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-orange uppercase tracking-wider mb-2">{countLabel} {countNoun} Available</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">Study MBBS in Top Countries</h2>
          <p className="mt-3 text-[15px] text-text-body max-w-2xl mx-auto">World-class medical education at affordable costs across {countLabel} {countNoun.toLowerCase()}.</p>
        </div>

        <div className="px-1 sm:px-5">
          <Carousel slideClass="basis-full px-1 sm:basis-1/2 sm:pl-5 sm:pr-0 lg:basis-1/3" maxDots={10}>
            {usingFallback ? countries.map((c: any) => (
              <div key={`${c.code}-${c.name}`} className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="bg-navy px-4 py-3 text-white">
                  <div className="flex items-center gap-2.5">
                    <SafeImage 
                      src={`https://flagcdn.com/w40/${c.code}.png`} 
                      alt={`${c.name} flag`} 
                      width={32}
                      height={24}
                      className="w-8 h-6 rounded-sm object-cover"
                      fallbackElement={
                        <div className="w-8 h-6 rounded-sm bg-white/20 flex items-center justify-center text-xs">🏳️</div>
                      }
                    />
                    <div>
                      <h3 className="font-heading text-[15px] font-bold truncate">{c.name}</h3>
                      <span className="text-[11px] opacity-90">{c.unis} Universities</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="rounded-lg bg-bg-light px-2.5 py-1.5 text-center">
                      <div className="text-[10px] uppercase text-text-body">Annual Fees</div>
                      <div className="text-[13px] font-bold text-orange">{c.fees}</div>
                    </div>
                    <div className="rounded-lg bg-bg-light px-2.5 py-1.5 text-center">
                      <div className="text-[10px] uppercase text-text-body">Duration</div>
                      <div className="text-[13px] font-bold text-navy">{c.dur}</div>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {c.highlights.map((h: string) => (
                      <li key={`${c.code}-${h}`} className="flex items-center gap-2 text-[13px] text-text-body">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Link href={`/countries/${getCountrySlugFromObject(c)}`} className="block w-full min-h-11 text-center py-3 rounded-full bg-orange text-white text-sm sm:text-[13px] font-bold hover:bg-orange-hover transition-colors">
                      View Universities
                    </Link>
                  </div>
                </div>
              </div>
            )) : countries.map((c: any) => {
              const imageSource = c.heroImage || c.cardImage || getStableCountryFallbackImage(c);
              const feeRange = c.feeRange || c.fees || c.annualFeeRange;
              const duration = c.duration || c.dur;
              const highlights = Array.isArray(c.highlights) ? c.highlights : [];

              return (
              <div key={c._id} className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Hero image area — shown when heroImage is available */}
                {imageSource ? (
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-navy">
                    <SafeImage
                      src={imageSource}
                      alt={getCountryImageAlt(c, imageSource)}
                      fill
                      className="object-cover"
                      fallbackElement={<div className="absolute inset-0 bg-linear-to-br from-navy to-navy/80" />}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-navy/80 via-navy/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between text-white">
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg sm:text-xl font-bold truncate drop-shadow-sm">{c.name || 'Country'}</h3>
                        {c.tagline && <span className="block truncate text-[11px] opacity-90 drop-shadow-sm">{c.tagline}</span>}
                      </div>
                      {c.flagImage && (
                        <SafeImage
                          src={c.flagImage}
                          alt={(c.flagImageAlt as string) || `${c.name} flag`}
                          width={36}
                          height={26}
                          className="h-6.5 w-9 shrink-0 rounded-sm object-cover ring-1 ring-white/30"
                          fallbackElement={
                            <div className="flex h-6.5 w-9 shrink-0 items-center justify-center rounded-sm bg-white/20 text-xs">🏳️</div>
                          }
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback: compact navy header when no hero image */
                  <div className="bg-navy px-4 py-3 text-white">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg sm:text-xl font-bold truncate">{c.name || 'Country'}</h3>
                        {c.tagline && <span className="block truncate text-[11px] opacity-90">{c.tagline}</span>}
                      </div>
                      {c.flagImage && (
                        <SafeImage
                          src={c.flagImage}
                          alt={(c.flagImageAlt as string) || `${c.name} flag`}
                          width={36}
                          height={26}
                          className="h-6.5 w-9 shrink-0 rounded-sm object-cover"
                          fallbackElement={
                            <div className="flex h-6.5 w-9 shrink-0 items-center justify-center rounded-sm bg-white/20 text-xs">🏳️</div>
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  {/* Fee & Duration */}
                  {(feeRange || duration) && (
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                      {feeRange && (
                        <div className="min-w-0 rounded-lg bg-bg-light px-2.5 py-1.5 text-center">
                          <div className="text-[10px] uppercase text-text-body">Annual Fees</div>
                          <div className="text-[13px] font-bold text-orange truncate" title={feeRange}>{feeRange}</div>
                        </div>
                      )}
                      {duration && (
                        <div className="min-w-0 rounded-lg bg-bg-light px-2.5 py-1.5 text-center">
                          <div className="text-[10px] uppercase text-text-body">Duration</div>
                          <div className="text-[13px] font-bold text-navy truncate" title={duration}>{duration}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Description snippet */}
                  {c.description && (
                    <p className="text-[13px] text-text-body leading-relaxed line-clamp-2 mb-3">{stripHtml(c.description)}</p>
                  )}
                  {/* Highlights */}
                  {highlights.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {highlights.slice(0, 4).map((h: string) => (
                      <li key={`${c.slug || c.name}-${h}`} className="flex items-center gap-2 text-[13px] text-text-body">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  )}
                  <div className="mt-auto">
                    <Link href={`/countries/${getCountrySlugFromObject(c)}`} className="block w-full min-h-11 text-center py-3 rounded-full bg-orange text-white text-sm sm:text-[13px] font-bold hover:bg-orange-hover transition-colors">
                      View Universities
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </Carousel>
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link href="/countries" className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-7 rounded-full border-2 border-navy text-navy text-[13px] sm:text-sm font-bold hover:bg-navy hover:text-white transition-colors">
            View All {countLabel} Countries →
          </Link>
        </div>
      </div>
    </section>
  );
}
