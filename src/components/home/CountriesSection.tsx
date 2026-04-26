'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';
import { SafeImage } from '@/components/ui/SafeImage';
import { getCountries } from '@/lib/countries';
import { extractCollectionData } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const fallbackCountries = [
  { name: 'Russia', code: 'ru', unis: '50+', fees: '₹2.5L – 6L', dur: '6 Yrs', highlights: ['No IELTS', 'WHO Approved', 'Low Cost'] },
  { name: 'Ukraine', code: 'ua', unis: '30+', fees: '₹3L – 5L', dur: '6 Yrs', highlights: ['English Medium', 'EU Recognition', 'Quality Edu'] },
  { name: 'Kazakhstan', code: 'kz', unis: '25+', fees: '₹3.5L – 7L', dur: '6 Yrs', highlights: ['Advanced Infra', 'Safe', 'Cultural Similarity'] },
  { name: 'Georgia', code: 'ge', unis: '15+', fees: '₹4L – 8L', dur: '6 Yrs', highlights: ['European Std', 'Modern', 'English Teaching'] },
  { name: 'Kyrgyzstan', code: 'kg', unis: '20+', fees: '₹2L – 4L', dur: '6 Yrs', highlights: ['Most Affordable', 'Indian Food', 'Easy Admission'] },
  { name: 'Philippines', code: 'ph', unis: '18+', fees: '₹3L – 6L', dur: '4 Yrs', highlights: ['English Speaking', 'US Curriculum', 'USMLE Prep'] },
];

export function CountriesSection() {
  const [countries, setCountries] = useState<any[]>(fallbackCountries);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    getCountries({ limit: 10 })
      .then((res) => {
        const items = extractCollectionData<any>(res, ['countries']);
        if (items.length > 0) {
          setCountries(items);
          setUsingFallback(false);
        } else {
          setCountries(fallbackCountries);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setCountries(fallbackCountries);
        setUsingFallback(true);
      });
  }, []);

  const countLabel = countries.length;

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-orange uppercase tracking-wider mb-2">{countLabel}+ Countries Available</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">Study MBBS in Top Countries</h2>
          <p className="mt-3 text-[15px] text-text-body max-w-2xl mx-auto">World-class medical education at affordable costs across {countLabel}+ countries.</p>
        </div>

        <div className="px-4 sm:px-5">
          <Carousel slideClass="basis-full sm:basis-1/2 lg:basis-1/3 pl-4 sm:pl-5">
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
                        <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Link href={`/countries/${c.name.toLowerCase()}`} className="block w-full text-center py-2.5 sm:py-2 rounded-full bg-orange text-white text-sm sm:text-[13px] font-bold hover:bg-orange-hover transition-colors">
                      View Universities
                    </Link>
                  </div>
                </div>
              </div>
            )) : countries.map((c: any) => (
              <div key={c._id} className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Hero image area — shown when heroImage is available */}
                {c.heroImage ? (
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-navy">
                    <SafeImage
                      src={c.heroImage}
                      alt={`${c.name || 'Country'} – MBBS study destination`}
                      fill
                      className="object-cover"
                      fallbackElement={<div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/80" />}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between text-white">
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg sm:text-xl font-bold truncate drop-shadow-sm">{c.name || 'Country'}</h3>
                        {c.tagline && <span className="block truncate text-[11px] opacity-90 drop-shadow-sm">{c.tagline}</span>}
                      </div>
                      {c.flagImage && (
                        <SafeImage
                          src={c.flagImage}
                          alt={`${c.name} flag`}
                          width={36}
                          height={26}
                          className="w-9 h-[26px] rounded-sm object-cover flex-shrink-0 ring-1 ring-white/30"
                          fallbackElement={
                            <div className="w-9 h-[26px] rounded-sm bg-white/20 flex items-center justify-center text-xs flex-shrink-0">🏳️</div>
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
                          alt={`${c.name} flag`}
                          width={36}
                          height={26}
                          className="w-9 h-[26px] rounded-sm object-cover flex-shrink-0"
                          fallbackElement={
                            <div className="w-9 h-[26px] rounded-sm bg-white/20 flex items-center justify-center text-xs flex-shrink-0">🏳️</div>
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  {/* Fee & Duration */}
                  {(c.feeRange || c.duration) && (
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                      {c.feeRange && (
                        <div className="min-w-0 rounded-lg bg-bg-light px-2.5 py-1.5 text-center">
                          <div className="text-[10px] uppercase text-text-body">Annual Fees</div>
                          <div className="text-[13px] font-bold text-orange truncate" title={c.feeRange}>{c.feeRange}</div>
                        </div>
                      )}
                      {c.duration && (
                        <div className="min-w-0 rounded-lg bg-bg-light px-2.5 py-1.5 text-center">
                          <div className="text-[10px] uppercase text-text-body">Duration</div>
                          <div className="text-[13px] font-bold text-navy truncate" title={c.duration}>{c.duration}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Description snippet */}
                  {c.description && (
                    <p className="text-[13px] text-text-body leading-relaxed line-clamp-2 mb-3">{c.description}</p>
                  )}
                  {/* Highlights */}
                  {c.highlights && c.highlights.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {c.highlights.slice(0, 4).map((h: string) => (
                      <li key={`${c.slug || c.name}-${h}`} className="flex items-center gap-2 text-[13px] text-text-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  )}
                  <div className="mt-auto">
                    <Link href={`/countries/${c.slug}`} className="block w-full text-center py-2.5 sm:py-2 rounded-full bg-orange text-white text-sm sm:text-[13px] font-bold hover:bg-orange-hover transition-colors">
                      View Universities
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link href="/countries" className="w-full sm:w-auto inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-navy text-navy text-[13px] sm:text-sm font-bold hover:bg-navy hover:text-white transition-colors">
            View All {countLabel} Countries →
          </Link>
        </div>
      </div>
    </section>
  );
}