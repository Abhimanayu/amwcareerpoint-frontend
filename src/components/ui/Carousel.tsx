'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
  children: ReactNode[];
  /** Classes applied to each slide wrapper */
  slideClass?: string;
  /** Show pagination dots */
  dots?: boolean;
  /** Maximum visible dot buttons. Use a smaller number for large carousels. */
  maxDots?: number;
}

export function Carousel({ children, slideClass = '', dots = true, maxDots }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const hasMultipleSlides = children.length > 1;

  const totalSlides = children.length;
  const effectiveMaxDots = typeof maxDots === 'number' && Number.isFinite(maxDots) && maxDots > 0
    ? Math.floor(maxDots)
    : totalSlides;

  const shouldCompactDots = totalSlides > effectiveMaxDots;
  const halfWindow = Math.floor(effectiveMaxDots / 2);
  const compactStart = shouldCompactDots
    ? Math.min(Math.max(selectedIndex - halfWindow, 0), totalSlides - effectiveMaxDots)
    : 0;
  const compactEnd = shouldCompactDots ? compactStart + effectiveMaxDots : totalSlides;
  const visibleDotIndices = Array.from(
    { length: Math.max(compactEnd - compactStart, 0) },
    (_, offset) => compactStart + offset
  );

  return (
    <div className="relative">
      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {children.map((child, i) => (
            <div key={i} className={`min-w-0 shrink-0 ${slideClass}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 z-10 w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white border border-[#DDD9D2] shadow-md flex items-center justify-center text-[#0D1B3E] hover:bg-[#F9F8F6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 z-10 w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-white border border-[#DDD9D2] shadow-md flex items-center justify-center text-[#0D1B3E] hover:bg-[#F9F8F6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {dots && children.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1 px-1 sm:gap-1.5">
          {shouldCompactDots && (
            <span aria-hidden="true" className="px-1 text-xs text-[#B5B0A8] sm:text-sm">...</span>
          )}
          {visibleDotIndices.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide group ${i + 1}`}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center sm:h-9 sm:w-9"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-colors sm:h-3 sm:w-3 ${
                    i === selectedIndex ? 'bg-[#F26419]' : 'bg-[#DDD9D2]'
                  }`}
                />
              </button>
          ))}
          {shouldCompactDots && (
            <span aria-hidden="true" className="px-1 text-xs text-[#B5B0A8] sm:text-sm">...</span>
          )}
        </div>
      )}
    </div>
  );
}
