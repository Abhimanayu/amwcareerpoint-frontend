import { Metadata } from 'next';
import Link from 'next/link';
import { getUniversities } from '@/lib/universities';
import { EmptyState } from '@/components/ui/EmptyState';
import { SafeImage } from '@/components/ui/SafeImage';
import { clampText, extractCollectionData, pickUniversityImageSource } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Top Medical Universities Abroad',
  description: 'Explore top medical universities for MBBS abroad with AMW Career Point. Find WHO and MCI approved universities in Russia, Ukraine, Georgia, and more countries.',
};

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

export default async function UniversitiesPage({ searchParams }: Readonly<Props>) {
  const { country } = await searchParams;
  const isIndia = country?.toLowerCase() === 'india';
  let universities: any[] = [];
  try {
    const params: Record<string, any> = { limit: 50 };
    if (country) params.country = country;
    const res = await getUniversities(params);
    universities = extractCollectionData<any>(res, ['universities']);
  } catch { /* API unavailable */ }

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-3">
            {isIndia ? 'MBBS in India' : 'Take a Look for Yourself'}
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold leading-[1.15] text-white mb-3">
            {isIndia ? 'Top Medical Colleges' : 'Top Medical Universities'}
            <span className="text-[#F26419]"> {isIndia ? 'in India' : 'We Partner With'}</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-blue-100 max-w-2xl mx-auto">
            {isIndia
              ? 'Discover top NMC approved medical colleges offering quality MBBS education in India.'
              : 'All partner universities are NMC approved and WHO recognized — your degree will be valid to practice in India.'}
          </p>
        </div>
      </section>

      {/* ── Count Bar ── */}
      <section className="bg-[#F9F8F6] border-b border-[#DDD9D2] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[14px] text-[#4A4742]">
            <span className="font-bold text-[#0D1B3E]">{universities.length}</span> Universities Available · All <span className="font-semibold text-[#F26419]">WHO Approved</span> & <span className="font-semibold text-[#F26419]">NMC Recognized</span>
          </p>
        </div>
      </section>

      {/* ── Universities Grid ── */}
      <section className="bg-[#F9F8F6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {universities.length === 0 ? (
            <EmptyState
              icon="🏫"
              title="No universities found"
              description="We're updating our university listings. Please check back soon or contact us for assistance."
              actionLabel="Contact Us"
              actionHref="/contact"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {universities.map((uni: any) => {
                const imageSource = pickUniversityImageSource(uni);
                const universityName = clampText(uni.name || 'University', 62);
                const countryName = clampText(uni.country?.name, 24);
                const accreditation = clampText(uni.accreditation, 38);
                const description = clampText(uni.description, 120);
                const annualFees = clampText(uni.annualFees, 18, {
                  fallback: 'On request',
                  preserveWords: false,
                });
                const duration = clampText(uni.courseDuration, 20, {
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
                  href={`/universities/${uni.slug}`}
                  className="group rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Image / Gradient header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0D1B3E] to-[#162550]">
                    {imageSource && (
                      <SafeImage
                        src={imageSource}
                        alt={uni.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                    {countryName && (
                      <span
                        title={uni.country?.name}
                        className="absolute top-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#0D1B3E]"
                      >
                        <span className="shrink-0">🌍</span>
                        <span className="truncate">{countryName}</span>
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
                        <div title={uni.courseDuration || duration} className="break-words text-[13px] font-bold text-[#0D1B3E] sm:truncate">
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
              Why Our Partner Universities?
            </h2>
            <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              We partner only with top-ranked, internationally accredited medical universities.
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
                Compare Universities
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DDD9D2]">
              <table className="w-full bg-white text-[13px]">
                <thead>
                  <tr className="bg-[#0D1B3E] text-white">
                    <th className="px-4 py-3 text-left font-semibold">University</th>
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
                      <td className="px-4 py-3 text-[#4A4742] whitespace-nowrap">{uni.country?.name || ''}</td>
                      <td className="px-4 py-3 font-semibold text-[#F26419] whitespace-nowrap">{uni.annualFees || '—'}</td>
                      <td className="px-4 py-3 text-[#4A4742] whitespace-nowrap">{uni.courseDuration || ''}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/universities/${uni.slug}`}
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
            Need Help Choosing the Right University?
          </h2>
          <p className="text-[14px] text-blue-100">
            Our expert consultants will help you find the perfect university based on your preferences and budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
            >
              Get University Recommendations
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
