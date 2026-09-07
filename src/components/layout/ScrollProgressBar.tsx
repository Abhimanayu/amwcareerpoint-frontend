'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgressBar() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
        : 0;

      if (progressRef.current) {
        progressRef.current.style.width = `${progress * 100}%`;
        progressRef.current.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      }
    };

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={progressRef}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="h-full w-0 bg-[#F26419] shadow-[0_1px_4px_rgba(242,100,25,0.35)] will-change-[width]"
      />
    </div>
  );
}
