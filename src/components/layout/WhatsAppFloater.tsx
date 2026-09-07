'use client';

import { useEffect, useState } from 'react';

export function WhatsAppFloater() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <a
      href="https://wa.me/919929299268"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_rgba(37,211,102,0.35)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 fill-current">
        <path d="M16.04 3C8.87 3 3.04 8.73 3.04 15.78c0 2.25.6 4.45 1.74 6.38L3 28.6l6.66-1.72a13.1 13.1 0 0 0 6.38 1.64C23.2 28.52 29 22.8 29 15.78 29 8.73 23.2 3 16.04 3Zm7.63 18.26c-.32.88-1.86 1.68-2.58 1.78-.66.06-1.5.1-2.42-.18-.56-.17-1.28-.41-2.2-.8-3.87-1.64-6.4-5.47-6.6-5.72-.2-.26-1.58-2.07-1.58-3.95 0-1.88 1-2.8 1.35-3.18.35-.38.77-.47 1.03-.47h.74c.24.01.56-.09.88.67.32.75 1.09 2.62 1.18 2.81.1.19.16.41.03.67-.13.25-.2.41-.39.63-.19.22-.4.49-.58.66-.19.19-.39.39-.16.77.23.38 1.02 1.65 2.19 2.67 1.5 1.32 2.77 1.73 3.16 1.92.39.19.61.16.84-.09.23-.26.97-1.12 1.23-1.5.26-.38.52-.32.87-.19.36.13 2.26 1.05 2.65 1.24.39.19.65.28.74.44.1.16.1.92-.22 1.8Z" />
      </svg>
    </a>
  );
}
