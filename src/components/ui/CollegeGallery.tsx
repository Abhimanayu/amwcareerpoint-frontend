'use client';

import { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';

interface CollegeGalleryProps {
  images: string[];
  universityName?: string;
  fallbackSrc?: string;
}

/**
 * Protected campus gallery with carousel.
 * Handles: empty array, broken images, single image.
 */
export function CollegeGallery({ images, universityName = 'Campus', fallbackSrc }: CollegeGalleryProps) {
  const [index, setIndex] = useState(0);
  const gallery = images.filter(Boolean);

  if (gallery.length === 0) return null;

  const safeIndex = Math.min(index, gallery.length - 1);
  const mainImage = gallery[safeIndex] || '';
  const useContainMain = /logo|poster|banner|badge|emblem/i.test(mainImage);

  return (
    <div className="max-w-full overflow-hidden">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
        {/* Main image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#DDD9D2] sm:aspect-[16/10] lg:aspect-[16/9]">
          <SafeImage
            src={gallery[safeIndex]}
            alt={`${universityName} campus`}
            fill
            className={useContainMain ? 'object-contain object-center bg-[#F7F6F2]' : 'object-cover object-center'}
            fallbackSrc={fallbackSrc}
            fallbackElement={
              <div className="flex h-full w-full items-center justify-center bg-[#DDD9D2] text-sm text-[#4A4742]">
                Image unavailable
              </div>
            }
          />
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setIndex((p) => (p === 0 ? gallery.length - 1 : p - 1))}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={() => setIndex((p) => (p === gallery.length - 1 ? 0 : p + 1))}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {safeIndex + 1} / {gallery.length}
          </div>
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:pb-0">
            {gallery.map((img, i) => (
              <button
                key={`thumb-${i}`}
                onClick={() => setIndex(i)}
                className={`relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all lg:h-24 lg:w-full ${
                  i === safeIndex
                    ? 'border-[#F26419]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                aria-label={`Image ${i + 1}`}
              >
                <SafeImage
                  src={img}
                  alt=""
                  fill
                  className="object-cover object-center"
                  fallbackSrc={fallbackSrc}
                  fallbackElement={
                    <div className="flex h-full w-full items-center justify-center bg-[#DDD9D2] text-[10px] text-[#4A4742]">—</div>
                  }
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
