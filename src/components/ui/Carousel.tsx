'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
  children: ReactNode[];
  /** Classes applied to each slide wrapper */
  slideClass?: string;
  /** Show pagination dots */
  dots?: boolean;
}

export function Carousel({ children, slideClass = '', dots = true }: CarouselProps) {
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
        <div className="mt-5 flex flex-wrap justify-center gap-x-1 gap-y-1 px-1">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide group ${i + 1}`}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center sm:h-11 sm:w-11"
              >
                <span
                  className={`h-3 w-3 rounded-full transition-colors sm:h-4 sm:w-4 ${
                    i === selectedIndex ? 'bg-[#F26419]' : 'bg-[#DDD9D2]'
                  }`}
                />
              </button>
          ))}
        </div>
      )}
    </div>
  );
}
