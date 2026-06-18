import { Metadata } from 'next';
import Link from 'next/link';
import { getUniversities } from '@/lib/universities';
import { getCountries, getCountryBySlug } from '@/lib/countries';
import { EmptyState } from '@/components/ui/EmptyState';
import { SafeImage } from '@/components/ui/SafeImage';
import { clampText, extractCollectionData, pickUniversityImageSource, resolveUniversityDuration, stripHtml } from '@/lib/utils';
import { SEO_HOLD } from '@/lib/seoHold';

export const metadata: Metadata = {
  ...(SEO_HOLD
    ? {
        title: 'AMW Career Point',
        description: 'AMW Career Point official website.',
        robots: {
          index: false,
          follow: false,
        },
      }
    : {
        title: 'Top Medical Colleges Abroad',
        description: 'Explore top medical colleges for MBBS abroad with AMW Career Point. Find WHO and MCI approved colleges in Russia, Ukraine, Georgia, and more countries.',
        alternates: { canonical: '/college' },
      }),
};

export const revalidate = 120;

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  searchParams: Promise<{ country?: string }>;
};

const UNIVERSITY_PROMISES = [
  { id: 'who', icon: '🏆', title: 'WHO Approved', desc: 'All universities are approved by the World Health Organization.' },
  { id: 'nmc', icon: '✅', title: 'NMC Recognition', desc: 'Degrees recognized by the National Medical Commission (NMC).' },
  { id: 'facilities', icon: '🔬', title: 'Modern Facilities', desc: 'State-of-the-art laboratories and research facilities.' },
  { id: 'faculty', icon: '👨‍🏫', title: 'Expert Faculty', desc: 'Experienced professors and international teaching staff.' },
];

function isMongoId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

function normalizeCountryFilterValue(value?: string) {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    return decodeURIComponent(trimmed).trim();
  } catch {
    return trimmed;
  }
}

async function resolveCountryFilterCandidates(countryFilter?: string) {
  const normalized = normalizeCountryFilterValue(countryFilter);
  if (!normalized) return [] as string[];

  const candidates: string[] = [];
  const pushCandidate = (candidate?: string) => {
    if (!candidate) return;
    const safeCandidate = candidate.trim();
    if (!safeCandidate) return;
    if (!candidates.includes(safeCandidate)) {
      candidates.push(safeCandidate);
    }
  };

  if (isMongoId(normalized)) {
    pushCandidate(normalized);
    try {
      const countriesResponse = await getCountries({ limit: 100 });
      const countries = extractCollectionData<Record<string, unknown>>(countriesResponse, ['countries']);
      const matchingCountry = countries.find((country) => country?._id === normalized);
      if (matchingCountry && typeof matchingCountry.slug === 'string') {
        pushCandidate(matchingCountry.slug);
      }
    } catch {
      // Keep id-only fallback if country lookup fails.
    }

    return candidates;
  }

  try {
    const countryResponse = await getCountryBySlug(normalized);
    const countryPayload = countryResponse?.data || countryResponse;
    if (countryPayload && typeof countryPayload === 'object') {
      const byId = typeof countryPayload._id === 'string' ? countryPayload._id : '';
      const bySlug = typeof countryPayload.slug === 'string' ? countryPayload.slug : '';
      // Prefer id first when available because universities APIs commonly key on ObjectId references.
      pushCandidate(byId);
      pushCandidate(bySlug);
    }
  } catch {
    // Fall through to raw value.
  }

  pushCandidate(normalized);
  return candidates;
}

function readUniversityCity(university: Record<string, any>) {
  const countryName = typeof university.country?.name === 'string' ? university.country.name.trim() : '';
  const city = typeof university.city === 'string' ? university.city.trim() : '';
  const location = typeof university.location === 'string' ? university.location.trim() : '';
  const resolvedCity = city || location;

  if (!resolvedCity || resolvedCity.toLowerCase() === countryName.toLowerCase()) {
    return '';
  }

  return resolvedCity;
}

function formatUniversityLocation(university: Record<string, any>) {
  const countryName = typeof university.country?.name === 'string' ? university.country.name.trim() : '';
  const city = readUniversityCity(university);
  if (countryName && city) return `${countryName}, ${city}`;
  return countryName || city;
}

export default async function CollegesPage({ searchParams }: Readonly<Props>) {
  const { country } = await searchParams;
  const normalizedCountry = normalizeCountryFilterValue(country);
  const isIndia = normalizedCountry.toLowerCase() === 'india';
  const countryFilterCandidates = await resolveCountryFilterCandidates(normalizedCountry);
  let universities: any[] = [];

  const filtersToTry = countryFilterCandidates.length > 0 ? countryFilterCandidates : [''];
  for (const countryFilter of filtersToTry) {
    try {
      const params: Record<string, any> = { limit: 500, sort: 'sortOrder' };
      if (countryFilter) params.country = countryFilter;
      const res = await getUniversities(params);
      universities = extractCollectionData<any>(res, ['universities']);
    } catch {
      universities = [];
    }

    if (universities.length > 0) {
      break;
    }
  }

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-3">
            {isIndia ? 'MBBS in India' : 'Take a Look for Yourself'}
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold leading-[1.15] text-white mb-3">
            {isIndia ? 'Top Medical Colleges' : 'Top Medical Colleges'}
            <span className="text-[#F26419]"> {isIndia ? 'in India' : 'We Partner With'}</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-blue-100 max-w-2xl mx-auto">
            {isIndia
              ? 'Discover top NMC approved medical colleges offering quality MBBS education in India.'
              : 'All partner colleges are NMC approved and WHO recognized — your degree will be valid to practice in India.'}
          </p>
        </div>
      </section>

      {/* ── Count Bar ── */}
      <section className="bg-[#F9F8F6] border-b border-[#DDD9D2] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[14px] text-[#4A4742]">
            <span className="font-bold text-[#0D1B3E]">{universities.length}</span> Colleges Available · All <span className="font-semibold text-[#F26419]">WHO Approved</span> & <span className="font-semibold text-[#F26419]">NMC Recognized</span>
          </p>
        </div>
      </section>

      {/* ── Universities Grid ── */}
      <section className="bg-[#F9F8F6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {universities.length === 0 ? (
            <EmptyState
              icon="🏫"
              title="No colleges found"
              description="We're updating our college listings. Please check back soon or contact us for assistance."
              actionLabel="Contact Us"
              actionHref="/contact"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {universities.map((uni: any) => {
                const imageSource = pickUniversityImageSource(uni);
                const useContainImage = typeof imageSource === 'string' && /logo|poster|banner|badge|emblem/i.test(imageSource);
                const universityName = clampText(uni.name || 'University', 62);
                const locationLabel = clampText(formatUniversityLocation(uni), 42);
                const accreditation = clampText(uni.accreditation, 38);
                const description = clampText(stripHtml(uni.description || ''), 120);
                const annualFees = clampText(uni.annualFees, 18, {
                  fallback: 'On request',
                  preserveWords: false,
                });
                const duration = clampText(resolveUniversityDuration(uni.courseDuration, Array.isArray(uni.curriculum) ? uni.curriculum.length : 0), 20, {
                  fallback: 'See details',
                  preserveWords: false,
                });
                const recognition = clampText(
                  Array.isArray(uni.recognition) ? uni.recognition.slice(0, 2).join(' · ') : '',
                  42
                );

                return (
                <Link
                  key={uni._id}
                  href={`/college/${uni.slug}`}
                  className="group rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Image / Gradient header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0D1B3E] to-[#162550]">
                    {imageSource && (
                      <SafeImage
                        src={imageSource}
                        alt={uni.name}
                        fill
                        className={useContainImage ? 'object-contain object-center bg-[#F7F6F2]' : 'object-cover object-center'}
                        fallbackElement={
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#162550] text-3xl text-white/30">🏫</div>
                        }
                      />
                    )}
                    {!imageSource && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#162550] text-4xl text-white/30">
                        🏫
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                    {locationLabel && (
                      <span
                        title={formatUniversityLocation(uni)}
                        className="absolute top-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#0D1B3E]"
                      >
                        <span className="shrink-0">🌍</span>
                        <span className="truncate">{locationLabel}</span>
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 title={uni.name || 'University'} className="font-heading text-[15px] font-bold text-[#0D1B3E] mb-1 line-clamp-2 group-hover:text-[#F26419] transition-colors">
                      {universityName}
                    </h3>

                    {accreditation && (
                      <p title={uni.accreditation} className="mb-2 truncate text-[11px] text-[#4A4742]">🏆 {accreditation}</p>
                    )}

                    {description && (
                      <p title={uni.description} className="mb-3 line-clamp-3 text-[13px] leading-relaxed text-[#4A4742]">
                        {description}
                      </p>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="min-w-0 rounded-lg bg-[#F9F8F6] px-2.5 py-1.5 text-center">
                        <div className="text-[10px] uppercase text-[#4A4742]">Fees / Year</div>
                        <div title={uni.annualFees || annualFees} className="break-words text-[13px] font-bold text-[#F26419] sm:truncate">
                          {annualFees}
                        </div>
                      </div>
                      <div className="min-w-0 rounded-lg bg-[#F9F8F6] px-2.5 py-1.5 text-center">
                        <div className="text-[10px] uppercase text-[#4A4742]">Duration</div>
                        <div title={resolveUniversityDuration(uni.courseDuration, Array.isArray(uni.curriculum) ? uni.curriculum.length : 0) || duration} className="break-words text-[13px] font-bold text-[#0D1B3E] sm:truncate">
                          {duration}
                        </div>
                      </div>
                    </div>

                    {/* Recognition */}
                    {recognition && (
                      <p title={Array.isArray(uni.recognition) ? uni.recognition.join(' · ') : undefined} className="mb-3 truncate text-[11px] text-[#4A4742]">
                        {recognition}
                        {Array.isArray(uni.recognition) && uni.recognition.length > 2 ? ' & more' : ''}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="mt-auto">
                      <span className="block w-full text-center py-2.5 sm:py-2 rounded-full bg-[#F26419] text-white text-sm sm:text-[13px] font-bold group-hover:bg-[#FF8040] transition-colors">
                        View Details & Apply →
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Our Universities ── */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Our Promise</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">
              Why Our Partner Colleges?
            </h2>
            <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              We partner only with top-ranked, internationally accredited medical colleges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {UNIVERSITY_PROMISES.map((f) => (
              <div key={f.id} className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5 hover:shadow-md transition-shadow text-center">
                <span className="text-2xl mb-2.5 block">{f.icon}</span>
                <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E] mb-1.5">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-[#4A4742]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      {universities.length > 0 && (
        <section className="bg-[#F9F8F6] py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Quick Compare</span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">
                Compare Colleges
              </h2>
            </div>

            {/* Mobile: Card layout */}
            <div className="space-y-3 sm:hidden">
              {universities.slice(0, 8).map((uni: any) => (
                <div key={`m-${uni._id}`} className="rounded-xl border border-[#DDD9D2] bg-white p-4">
                  <div className="font-semibold text-[#0D1B3E] text-sm mb-1 line-clamp-2">{uni.name}</div>
                  {uni.accreditation && <div className="text-[11px] text-[#4A4742] truncate mb-2">{uni.accreditation}</div>}
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="rounded-lg bg-[#F9F8F6] px-2 py-1.5">
                      <div className="text-[10px] uppercase text-[#4A4742]">Country</div>
                      <div className="text-[12px] font-semibold text-[#0D1B3E] truncate">{formatUniversityLocation(uni) || '—'}</div>
                    </div>
                    <div className="rounded-lg bg-[#F9F8F6] px-2 py-1.5">
                      <div className="text-[10px] uppercase text-[#4A4742]">Fees/Yr</div>
                      <div className="text-[12px] font-semibold text-[#F26419] truncate">{uni.annualFees || '—'}</div>
                    </div>
                    <div className="rounded-lg bg-[#F9F8F6] px-2 py-1.5">
                      <div className="text-[10px] uppercase text-[#4A4742]">Duration</div>
                      <div className="text-[12px] font-semibold text-[#0D1B3E] truncate">{resolveUniversityDuration(uni.courseDuration, Array.isArray(uni.curriculum) ? uni.curriculum.length : 0) || '—'}</div>
                    </div>
                  </div>
                  <Link
                    href={`/college/${uni.slug}`}
                    className="block w-full text-center rounded-full border border-[#F26419] text-[#F26419] py-2 text-[12px] font-semibold hover:bg-[#F26419] hover:text-white transition-colors"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#DDD9D2]">
              <table className="w-full bg-white text-[13px]">
                <thead>
                  <tr className="bg-[#0D1B3E] text-white">
                    <th className="px-4 py-3 text-left font-semibold">College</th>
                    <th className="px-4 py-3 text-left font-semibold">Country</th>
                    <th className="px-4 py-3 text-left font-semibold">Fees / Year</th>
                    <th className="px-4 py-3 text-left font-semibold">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD9D2]">
                  {universities.slice(0, 8).map((uni: any) => (
                    <tr key={uni._id} className="hover:bg-[#F9F8F6] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#0D1B3E] max-w-[200px] truncate">{uni.name}</div>
                        {uni.accreditation && <div className="text-[11px] text-[#4A4742] truncate max-w-[200px]">{uni.accreditation}</div>}
                      </td>
                      <td className="px-4 py-3 text-[#4A4742] whitespace-nowrap">{formatUniversityLocation(uni)}</td>
                      <td className="px-4 py-3 font-semibold text-[#F26419] whitespace-nowrap">{uni.annualFees || '—'}</td>
                      <td className="px-4 py-3 text-[#4A4742] whitespace-nowrap">{resolveUniversityDuration(uni.courseDuration, Array.isArray(uni.curriculum) ? uni.curriculum.length : 0) || ''}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/college/${uni.slug}`}
                          className="inline-flex items-center justify-center rounded-full border border-[#F26419] text-[#F26419] px-4 py-1.5 text-[12px] font-semibold hover:bg-[#F26419] hover:text-white transition-colors whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">
            Need Help Choosing the Right College?
          </h2>
          <p className="text-[14px] text-blue-100">
            Our expert consultants will help you find the perfect college based on your preferences and budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
            >
              Get College Recommendations
            </Link>
            <Link
              href="/countries"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-white text-white text-[13px] sm:text-sm font-bold hover:bg-white hover:text-[#0D1B3E] transition-colors"
            >
              Explore by Country
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
