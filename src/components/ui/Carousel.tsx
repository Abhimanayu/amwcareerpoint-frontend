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

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
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
            className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#DDD9D2] shadow-md flex items-center justify-center text-[#0D1B3E] hover:bg-[#F9F8F6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#DDD9D2] shadow-md flex items-center justify-center text-[#0D1B3E] hover:bg-[#F9F8F6] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {dots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide group ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === selectedIndex ? 'bg-[#F26419]' : 'bg-[#DDD9D2]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
