'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';
import { SafeImage } from '@/components/ui/SafeImage';
import { getUniversities } from '@/lib/universities';
import { extractCollectionData, pickUniversityImageSource } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const fallbackUniversities = [
  { name: 'Kharkiv National Medical University', country: 'Ukraine', image: '/universities/kharkiv.jpg' },
  { name: 'NJSC Astana Medical University', country: 'Kazakhstan', image: '/universities/astana.jpg' },
  { name: 'I.K. Akhunbaev Kyrgyz State Medical Academy', country: 'Kyrgyzstan', image: '/universities/kyrgyz.jpg' },
  { name: 'Tashkent Medical Academy', country: 'Uzbekistan', image: '/universities/tashkent.jpg' },
  { name: 'First Moscow State Medical University', country: 'Russia', image: '/universities/moscow.jpg' },
  { name: 'Bogomolets National Medical University', country: 'Ukraine', image: '/universities/bogomolets.jpg' },
];

export function UniversitiesSection() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getUniversities({ limit: 20 })
      .then((res) => {
        const items = extractCollectionData<any>(res, ['universities']);
        if (items.length > 0) setUniversities(items);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const useFallback = loaded && universities.length === 0;

  if (!loaded) return null;
  return (
    <section className="bg-[#F9F8F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading — left aligned like screenshot */}
        <div className="mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">
            Take a Look for Yourself
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">
            Top Medical Universities
          </h2>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-600">
            We Partner With
          </h2>
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#4A4742] max-w-2xl">
            All partner universities are NMC approved and WHO recognized — your degree will be valid to practice in India after clearing FMGE/NExT.
          </p>
        </div>

        {/* Image carousel */}
        <div className="px-4 sm:px-5">
          <Carousel slideClass="basis-full sm:basis-1/2 lg:basis-1/4 pl-3 sm:pl-4" dots={false}>
            {useFallback ? fallbackUniversities.map((uni, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[3/4] sm:aspect-[3/4] lg:aspect-[3/4]">
                <SafeImage 
                  src={uni.image} 
                  alt={uni.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackElement={<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-3xl text-white/30">🏫</div>}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                  <p className="text-white text-[11px] sm:text-xs font-medium leading-snug drop-shadow-md">{uni.name}</p>
                </div>
              </div>
            )) : universities.map((uni: any) => {
              const imageSource = pickUniversityImageSource(uni);

              return (
              <Link key={uni._id} href={`/universities/${uni.slug}`} className="block">
                <div className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[3/4] sm:aspect-[3/4] lg:aspect-[3/4]">
                  {imageSource ? (
                    <SafeImage
                      src={imageSource}
                      alt={uni.name || 'University'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackElement={<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                  <p className="text-white text-[11px] sm:text-xs font-medium leading-snug drop-shadow-md line-clamp-2">{uni.name}</p>
                  {uni.country?.name && <p className="text-white/80 text-[10px] drop-shadow-md truncate">{uni.country.name}</p>}
                  </div>
                </div>
              </Link>
              );
            })}
          </Carousel>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/universities"
            className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
          >
            Show All Universities →
          </Link>
        </div>
      </div>
    </section>
  );
}