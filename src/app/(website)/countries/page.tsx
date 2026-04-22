import { Metadata } from 'next';
import Link from 'next/link';
import { getCountries } from '@/lib/countries';
import { EmptyState } from '@/components/ui/EmptyState';
import { SafeImage } from '@/components/ui/SafeImage';
import { extractCollectionData, resolveMediaUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Countries for MBBS Abroad',
  description: 'Explore top countries for MBBS abroad with AMW Career Point including Russia, Ukraine, Georgia, Kazakhstan and more. Find the best destination for your medical education.',
};

const COUNTRY_PAGE_FEATURES = [
  { id: 'fees', icon: '💰', title: 'Affordable Fees', desc: 'Much lower tuition fees compared to private medical colleges in India.' },
  { id: 'quality', icon: '🏆', title: 'Quality Education', desc: 'WHO and NMC approved universities with modern facilities.' },
  { id: 'recognition', icon: '🌍', title: 'Global Recognition', desc: 'Degrees recognized worldwide for practice and higher studies.' },
  { id: 'english', icon: '📚', title: 'English Medium', desc: 'Courses taught in English with experienced international faculty.' },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function CountriesPage() {
  let countries: any[] = [];
  try {
    const res = await getCountries({ limit: 50 });
    countries = extractCollectionData<any>(res, ['countries']);
  } catch { /* API unavailable */ }

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-3">
            16+ Countries Available
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold leading-[1.15] text-white mb-3">
            Study MBBS <span className="text-[#F26419]">Abroad</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-blue-100 max-w-2xl mx-auto">
            Explore top destinations for medical education with affordable fees and globally recognized degrees.
          </p>
        </div>
      </section>



      {/* ── Countries Grid ── */}
      <section className="bg-[#F9F8F6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Popular Destinations</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">
              Choose Your Country
            </h2>
            <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              Carefully selected countries that offer world-class medical education at affordable costs.
            </p>
          </div>

          {countries.length === 0 ? (
            <EmptyState
              icon="🌍"
              title="No countries available"
              description="We're updating our country listings. Please check back soon."
              actionLabel="Contact Us"
              actionHref="/contact"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {countries.map((country: any) => (
                <Link
                  key={country._id}
                  href={`/countries/${country.slug}`}
                  className="group rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Header with flag */}
                  <div className="bg-[#0D1B3E] px-4 py-3 text-white">
                    <div className="flex items-center gap-2.5">
                      {country.flagImage ? (
                        <SafeImage 
                          src={country.flagImage} 
                          alt={`${country.name} flag`} 
                          width={32}
                          height={24}
                          className="w-8 h-6 rounded-sm object-cover"
                          fallbackElement={
                            <div className="w-8 h-6 rounded-sm bg-white/20 flex items-center justify-center text-xs">🏳️</div>
                          }
                        />
                      ) : (
                        <div className="w-8 h-6 rounded-sm bg-white/20 flex items-center justify-center text-xs">🏳️</div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-heading text-[15px] font-bold truncate">{country.name || 'Country'}</h3>
                        {country.tagline && <span className="text-[11px] opacity-90 truncate block">{country.tagline}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    {country.description && (
                      <p className="text-[13px] text-[#4A4742] leading-relaxed mb-3 line-clamp-2">
                        {country.description}
                      </p>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                      {country.feeRange && (
                        <div className="rounded-lg bg-[#F9F8F6] px-2.5 py-1.5 text-center">
                          <div className="text-[10px] uppercase text-[#4A4742]">Annual Fees</div>
                          <div className="text-[13px] font-bold text-[#F26419]">{country.feeRange}</div>
                        </div>
                      )}
                      {country.duration && (
                        <div className="rounded-lg bg-[#F9F8F6] px-2.5 py-1.5 text-center">
                          <div className="text-[10px] uppercase text-[#4A4742]">Duration</div>
                          <div className="text-[13px] font-bold text-[#0D1B3E]">{country.duration}</div>
                        </div>
                      )}
                    </div>

                    {/* Highlights */}
                    {Array.isArray(country.highlights) && country.highlights.length > 0 && (
                      <ul className="space-y-1 mb-3">
                        {country.highlights.slice(0, 3).map((h: string) => (
                          <li key={h} className="flex items-center gap-2 text-[13px] text-[#4A4742]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F26419] flex-shrink-0" />
                            <span className="truncate">{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA */}
                    <div className="mt-auto">
                      <span className="block w-full text-center py-2 rounded-full bg-[#F26419] text-white text-[13px] font-bold group-hover:bg-[#FF8040] transition-colors">
                        Explore Universities →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Study Abroad ── */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Advantages</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">
              Why Study MBBS Abroad?
            </h2>
            <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              Discover the key advantages of pursuing medical education internationally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {COUNTRY_PAGE_FEATURES.map((f) => (
              <div key={f.id} className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5 hover:shadow-md transition-shadow text-center">
                <span className="text-2xl mb-2.5 block">{f.icon}</span>
                <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E] mb-1.5">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-[#4A4742]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">
            Ready to Choose Your Destination?
          </h2>
          <p className="text-[14px] text-blue-100">
            Get personalized guidance on selecting the best country for your medical education.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-white text-white text-[13px] sm:text-sm font-bold hover:bg-white hover:text-[#0D1B3E] transition-colors"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}