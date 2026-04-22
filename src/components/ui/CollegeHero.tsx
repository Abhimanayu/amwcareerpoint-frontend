import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { resolveMediaUrl } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CollegeHeroProps {
  name: string;
  heroImage?: string;
  countryName?: string;
  countryFlagImage?: string;
  establishedYear?: number;
  accreditation?: string;
  medium?: string;
  annualFees?: string;
  courseDuration?: string;
  hostelFees?: string;
}

/**
 * Protected hero section for college detail pages.
 * Handles: missing hero image (gradient fallback), missing fields.
 */
export function CollegeHero({
  name,
  heroImage,
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

  return (
    <section className="relative isolate overflow-hidden bg-[#0D1B3E]">
      {resolvedHeroImage ? (
        <SafeImage
          src={resolvedHeroImage}
          alt={name || 'University'}
          fill
          className="object-cover object-center"
          fallbackElement={<div className="absolute inset-0 bg-[#0D1B3E]" />}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B3E] via-[#0D1B3E]/90 to-[#0D1B3E]/40" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {countryName && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
              {resolvedCountryFlagImage && (
                <SafeImage
                  src={resolvedCountryFlagImage}
                  alt={countryName}
                  width={20}
                  height={14}
                  className="rounded-[2px]"
                  fallbackElement={<span className="block h-[14px] w-5 rounded-[2px] bg-white/20" />}
                />
              )}
              <span className="text-white/90">
                {countryName}
                {establishedYear ? ` · Est. ${establishedYear}` : ''}
              </span>
            </span>
          )}

          <h1 className="line-clamp-3 break-words font-heading text-[2rem] font-bold leading-[1.08] text-white sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem]">
            {name || 'University'}
          </h1>

          <p className="mt-4 max-w-xl truncate text-[15px] leading-relaxed text-white/60 sm:text-base">
            {[countryName, accreditation ? accreditation : null, medium ? `${medium} medium` : null]
              .filter(Boolean)
              .join(' · ') || '\u00A0'}
          </p>

          {/* Stat badges */}
          <div className="mt-10 flex flex-wrap gap-3">
            {annualFees && (
              <div className="min-w-[100px] rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-center backdrop-blur-sm">
                <div className="truncate text-lg font-bold leading-tight text-[#F26419] sm:text-xl">{annualFees}</div>
                <div className="mt-1 text-[11px] text-white/50">Annual Fees</div>
              </div>
            )}
            {courseDuration && (
              <div className="min-w-[100px] rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-center backdrop-blur-sm">
                <div className="truncate text-lg font-bold leading-tight text-white sm:text-xl">{courseDuration}</div>
                <div className="mt-1 text-[11px] text-white/50">Duration</div>
              </div>
            )}
            <div className="min-w-[100px] rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-center backdrop-blur-sm">
              <div className="text-lg font-bold leading-tight text-emerald-400 sm:text-xl">No</div>
              <div className="mt-1 text-[11px] text-white/50">Donation</div>
            </div>
            {hostelFees && (
              <div className="min-w-[100px] rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-center backdrop-blur-sm">
                <div className="truncate text-lg font-bold leading-tight text-white sm:text-xl">{hostelFees}</div>
                <div className="mt-1 text-[11px] text-white/50">Hostel / yr</div>
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#F26419] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040] sm:text-base">
              Apply Now →
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:text-base">
              Talk to Counsellor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
