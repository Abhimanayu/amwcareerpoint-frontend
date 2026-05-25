import Link from 'next/link';
import { CounsellingForm } from '@/components/home/CounsellingForm';
import { SafeImage } from '@/components/ui/SafeImage';
import { resolveMediaUrl } from '@/lib/utils';

interface CollegeHeroProps {
  name: string;
  heroImage?: string;
  heroImageAlt?: string;
  countryName?: string;
  countryFlagImage?: string;
  establishedYear?: number;
  accreditation?: string;
  medium?: string;
  annualFees?: string;
  courseDuration?: string;
  hostelFees?: string;
}

export function CollegeHero({
  name,
  heroImage,
  heroImageAlt,
  countryName,
  countryFlagImage,
  establishedYear,
  accreditation,
  medium,
  annualFees,
  courseDuration,
  hostelFees,
}: CollegeHeroProps) {
  const resolvedHeroImage = resolveMediaUrl(heroImage);
  const resolvedCountryFlagImage = resolveMediaUrl(countryFlagImage);
  const metaLine = [countryName, accreditation || null, medium ? `${medium} medium` : null]
    .filter(Boolean)
    .join(' | ');

  return (
    <section className="relative isolate overflow-hidden bg-[#0D1B3E]">
      {resolvedHeroImage && (
        <SafeImage
          src={resolvedHeroImage}
          alt={heroImageAlt || name || 'University'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          fallbackElement={<div className="absolute inset-0 bg-[#0D1B3E]" />}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B3E]/62 via-[#0D1B3E]/42 to-[#0D1B3E]/18" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B3E]/12 via-transparent to-[#0D1B3E]/40" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-12">
          <div className="max-w-2xl">
            {countryName && (
              <span className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                {resolvedCountryFlagImage && (
                  <SafeImage
                    src={resolvedCountryFlagImage}
                    alt={countryName}
                    width={20}
                    height={14}
                    className="shrink-0 rounded-[2px] object-cover"
                    fallbackElement={<span className="block h-[14px] w-5 rounded-[2px] bg-white/20" />}
                  />
                )}
                <span className="truncate text-white/90">
                  {countryName}
                  {establishedYear ? ` | Est. ${establishedYear}` : ''}
                </span>
              </span>
            )}

            <h1 className="line-clamp-none sm:line-clamp-4 wrap-anywhere font-heading text-[clamp(1.7rem,8.4vw,2.35rem)] font-bold leading-[1.12] text-white sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]">
              {name || 'University'}
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/72 sm:text-base">
              {metaLine || '\u00A0'}
            </p>

            <div className="mt-8 grid w-full grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mt-10 lg:flex lg:flex-wrap">
              {annualFees && (
                <div className="min-w-0 w-full min-[420px]:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-center backdrop-blur-sm lg:min-w-[100px] lg:px-5 lg:w-auto">
                  <div className="whitespace-normal wrap-anywhere text-base font-bold leading-snug text-[#F26419] sm:text-xl">{annualFees}</div>
                  <div className="mt-1 text-[11px] text-white/50">Annual Fees</div>
                </div>
              )}
              {courseDuration && (
                <div className="min-w-0 w-full min-[420px]:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-center backdrop-blur-sm lg:min-w-[100px] lg:px-5 lg:w-auto">
                  <div className="whitespace-normal wrap-anywhere text-base font-bold leading-snug text-white sm:text-xl">{courseDuration}</div>
                  <div className="mt-1 text-[11px] text-white/50">Duration</div>
                </div>
              )}
              <div className="min-w-0 w-full min-[420px]:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-center backdrop-blur-sm lg:min-w-[100px] lg:px-5 lg:w-auto">
                <div className="text-lg font-bold leading-tight text-emerald-400 sm:text-xl">No</div>
                <div className="mt-1 text-[11px] text-white/50">Donation</div>
              </div>
              {hostelFees && (
                <div className="min-w-0 w-full min-[420px]:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-center backdrop-blur-sm lg:min-w-[100px] lg:px-5 lg:w-auto">
                  <div className="whitespace-normal wrap-anywhere text-base font-bold leading-snug text-white sm:text-xl">{hostelFees}</div>
                  <div className="mt-1 text-[11px] text-white/50">Hostel / yr</div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row sm:mt-10 sm:gap-4">
              <Link href="#counselling" className="inline-flex items-center justify-center rounded-full bg-[#F26419] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040] sm:text-base">
                {'Apply Now ->'}
              </Link>
              <Link href="#counselling" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:text-base">
                Talk to Counsellor
              </Link>
            </div>
          </div>

          <div id="counselling" className="w-full scroll-mt-24 lg:pt-2">
            <CounsellingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
