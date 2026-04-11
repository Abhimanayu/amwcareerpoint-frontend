'use client';

import { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';

interface CollegeGalleryProps {
  images: string[];
  universityName?: string;
}

/**
 * Protected campus gallery with carousel.
 * Handles: empty array, broken images, single image.
 */
export function CollegeGallery({ images, universityName = 'Campus' }: CollegeGalleryProps) {
  const [index, setIndex] = useState(0);
  const gallery = images.filter(Boolean);

  if (gallery.length === 0) return null;

  const safeIndex = Math.min(index, gallery.length - 1);

  return (
    <div>
      {/* Main image */}
      <div className="relative mb-4 aspect-[16/7] overflow-hidden rounded-2xl bg-[#DDD9D2]">
        <SafeImage
          src={gallery[safeIndex]}
          alt={`${universityName} campus`}
          fill
          className="object-cover"
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
        <div className="flex gap-2 overflow-x-auto pb-2">
          {gallery.map((img, i) => (
            <button
              key={`thumb-${i}`}
              onClick={() => setIndex(i)}
              className={`relative h-14 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all sm:h-16 sm:w-24 ${
                i === safeIndex
                  ? 'border-[#F26419]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <SafeImage
                src={img}
                alt=""
                fill
                className="object-cover"
                fallbackElement={
                  <div className="flex h-full w-full items-center justify-center bg-[#DDD9D2] text-[10px] text-[#4A4742]">—</div>
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
