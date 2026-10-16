'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnapCount, setScrollSnapCount] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || nearViewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '450px 0px' }
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [nearViewport]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!nearViewport || !viewport) return;

    let disposed = false;
    let api: EmblaCarouselType | undefined;
    void import('embla-carousel').then(({ default: EmblaCarousel }) => {
      if (disposed) return;
      api = EmblaCarousel(viewport, {
        align: 'start',
        slidesToScroll: 1,
        loop: true,
      });
      setEmblaApi(api);
    });

    return () => {
      disposed = true;
      api?.destroy();
      setEmblaApi(null);
    };
  }, [nearViewport]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScroll(emblaApi.canScrollPrev() || emblaApi.canScrollNext());
  }, [emblaApi]);

  const syncCarouselState = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnapCount(emblaApi.scrollSnapList().length);
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScroll(emblaApi.canScrollPrev() || emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const frame = window.requestAnimationFrame(syncCarouselState);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', syncCarouselState);
    return () => {
      window.cancelAnimationFrame(frame);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', syncCarouselState);
    };
  }, [emblaApi, onSelect, syncCarouselState]);

  const hasMultipleSlides = children.length > 1 && canScroll;

  const totalSlides = Math.max(scrollSnapCount, 0);
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
      <div className="overflow-hidden" ref={viewportRef}>
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
      {dots && hasMultipleSlides && totalSlides > 1 && (
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
