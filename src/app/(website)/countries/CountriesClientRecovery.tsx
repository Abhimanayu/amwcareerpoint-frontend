'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/EmptyState';
import { SafeImage } from '@/components/ui/SafeImage';
import { getCountries } from '@/lib/countries';
import { getCountrySlugFromObject } from '@/lib/slugUtils';
import { extractCollectionData } from '@/lib/utils';

type Country = {
  _id: string;
  name?: string;
  slug?: string;
  tagline?: string;
  cardImage?: string;
  cardImageAlt?: string;
  heroImage?: string;
  flagImage?: string;
  flagImageAlt?: string;
  feeRange?: string;
  duration?: string;
};

export function CountriesClientRecovery() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCountries({ limit: 50 })
      .then((response) => {
        if (!cancelled) {
          setCountries(extractCollectionData<Country>(response, ['countries']));
        }
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((item) => (
          <div key={item} className="overflow-hidden rounded-xl border border-[#DDD9D2] bg-white">
            <div className="aspect-[16/9] animate-pulse bg-[#F1F0ED]" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#F1F0ED]" />
              <div className="h-3 w-full animate-pulse rounded bg-[#F1F0ED]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <EmptyState
        icon="🌍"
        title="No countries available"
        description="We're updating our country listings. Please check back soon."
        actionLabel="Contact Us"
        actionHref="/contact"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {countries.map((country) => (
        <Link
          key={country._id}
          href={`/countries/${getCountrySlugFromObject(country)}`}
          className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#DDD9D2] bg-white transition-shadow hover:shadow-md"
        >
          {(country.cardImage || country.heroImage) && (
            <div className="aspect-[16/9] overflow-hidden bg-[#F1F0ED]">
              <SafeImage
                src={country.cardImage || country.heroImage || ''}
                alt={country.cardImageAlt || `${country.name || 'Country'} medical education`}
                width={960}
                height={540}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          )}
          <div className="bg-[#0D1B3E] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              {country.flagImage && (
                <SafeImage
                  src={country.flagImage}
                  alt={country.flagImageAlt || `${country.name || 'Country'} flag`}
                  width={32}
                  height={24}
                  className="h-6 w-8 rounded-sm object-cover"
                />
              )}
              <div className="min-w-0">
                <h3 className="truncate font-heading text-[15px] font-bold">{country.name || 'Country'}</h3>
                {country.tagline && <p className="truncate text-[11px] opacity-90">{country.tagline}</p>}
              </div>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2.5 p-4 text-center">
            <div className="rounded-lg bg-[#F9F8F6] px-2.5 py-2">
              <span className="block text-[10px] uppercase text-[#4A4742]">Annual Fees</span>
              <span className="text-[13px] font-bold text-[#F26419]">{country.feeRange || 'On request'}</span>
            </div>
            <div className="rounded-lg bg-[#F9F8F6] px-2.5 py-2">
              <span className="block text-[10px] uppercase text-[#4A4742]">Duration</span>
              <span className="text-[13px] font-bold text-[#0D1B3E]">{country.duration || 'See details'}</span>
            </div>
            <span className="col-span-2 mt-auto block rounded-full bg-[#F26419] py-2.5 text-center text-sm font-bold text-white transition-colors group-hover:bg-[#FF8040]">
              Explore Universities →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
