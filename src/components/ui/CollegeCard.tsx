import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { pickUniversityImageSource } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CollegeCardProps {
  university: any;
}

/**
 * Protected university card for listing grids.
 * Handles: missing images, long names, missing fields.
 */
export function CollegeCard({ university }: CollegeCardProps) {
  const name = university?.name || 'University';
  const slug = university?.slug;
  const country = university?.country?.name || '';
  const fees = university?.annualFees || '';
  const duration = university?.courseDuration || '';
  const heroImage = pickUniversityImageSource(university);
  const description = university?.description || '';
  const accreditation = university?.accreditation || '';

  const content = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DDD9D2] bg-white transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden bg-[#0D1B3E]">
        {heroImage ? (
          <SafeImage
            src={heroImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackElement={
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#162550] text-3xl text-white/30">🏫</div>
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#162550] text-3xl text-white/30">🏫</div>
        )}
        {country && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#0D1B3E] backdrop-blur-sm">
            {country}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 break-words text-base font-semibold text-[#0D1B3E] transition-colors group-hover:text-[#F26419]">
          {name}
        </h3>

        {accreditation && (
          <p className="mt-1 truncate text-xs text-[#4A4742]">🏆 {accreditation}</p>
        )}

        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4A4742]">
            {description}
          </p>
        )}

        {/* Stats row — always at bottom */}
        <div className="mt-auto flex flex-wrap gap-3 pt-4 text-xs text-[#4A4742]">
          {fees && (
            <span className="rounded-full bg-[#F9F8F6] px-2.5 py-1 font-semibold text-[#F26419]">
              💰 {fees}
            </span>
          )}
          {duration && (
            <span className="rounded-full bg-[#F9F8F6] px-2.5 py-1">
              ⏱ {duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (slug) {
    return <Link href={`/universities/${slug}`} className="block h-full">{content}</Link>;
  }
  return content;
}
