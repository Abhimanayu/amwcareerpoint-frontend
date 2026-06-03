'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type MouseEvent } from 'react';

export function MobileStickyCTA() {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const counsellingSection = document.getElementById('counselling');

    if (!counsellingSection) {
      return;
    }

    event.preventDefault();
    counsellingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    globalThis.history.replaceState(null, '', '#counselling');
  };

  const isContactPage = pathname === '/contact';
  if (isContactPage) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden">
      <Link
        href="#counselling"
        onClick={handleClick}
        className="pointer-events-auto flex h-12 w-full items-center justify-center rounded-full bg-[#F26419] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(242,100,25,0.35)] transition-colors hover:bg-[#FF8040]"
      >
        Get Free Counselling
      </Link>
    </div>
  );
}
