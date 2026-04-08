'use client';

import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';

export function CountriesSection() {
  const countries = [
    { name: 'Russia', code: 'ru', unis: '50+', fees: '₹2.5L – 6L', dur: '6 Yrs', highlights: ['No IELTS', 'WHO Approved', 'Low Cost'] },
    { name: 'Ukraine', code: 'ua', unis: '30+', fees: '₹3L – 5L', dur: '6 Yrs', highlights: ['English Medium', 'EU Recognition', 'Quality Edu'] },
    { name: 'Kazakhstan', code: 'kz', unis: '25+', fees: '₹3.5L – 7L', dur: '6 Yrs', highlights: ['Advanced Infra', 'Safe', 'Cultural Similarity'] },
    { name: 'Georgia', code: 'ge', unis: '15+', fees: '₹4L – 8L', dur: '6 Yrs', highlights: ['European Std', 'Modern', 'English Teaching'] },
    { name: 'Kyrgyzstan', code: 'kg', unis: '20+', fees: '₹2L – 4L', dur: '6 Yrs', highlights: ['Most Affordable', 'Indian Food', 'Easy Admission'] },
    { name: 'Philippines', code: 'ph', unis: '18+', fees: '₹3L – 6L', dur: '4 Yrs', highlights: ['English Speaking', 'US Curriculum', 'USMLE Prep'] },
  ];

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-orange uppercase tracking-wider mb-2">16+ Countries Available</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">Study MBBS in Top Countries</h2>
          <p className="mt-3 text-[15px] text-text-body max-w-2xl mx-auto">World-class medical education at affordable costs across 16+ countries.</p>
        </div>

        <div className="px-4 sm:px-5">
          <Carousel slideClass="basis-full sm:basis-1/2 lg:basis-1/3 pl-4 sm:pl-5">
            {countries.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Navy header */}
                <div className="bg-navy px-4 py-3 text-white">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/w40/${c.code}.png`}
                      srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
                      alt={`${c.name} flag`}
                      className="w-8 h-6 rounded-sm object-cover"
                    />
                    <div>
                      <h3 className="font-heading text-[15px] font-bold">{c.name}</h3>
                      <span className="text-[11px] opacity-90">{c.unis} Universities</span>
                    </div>
                  </div>
                </div>
                {/* Body */}
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
                    {c.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-2 text-[13px] text-text-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Link href={`/countries/${c.name.toLowerCase()}`} className="block w-full text-center py-2 rounded-full bg-orange text-white text-[13px] font-bold hover:bg-orange-hover transition-colors">
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
            View All 16 Countries →
          </Link>
        </div>
      </div>
    </section>
  );
}