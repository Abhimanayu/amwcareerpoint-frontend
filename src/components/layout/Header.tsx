'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
  { href: '/', label: 'Home' },
  { href: '/countries', label: 'MBBS India' },
  { href: '/universities', label: 'MBBS Abroad', caret: true },
  { href: '#', label: 'College Predictor' },
  { href: '/blogs', label: 'Blog', caret: true },
  { href: '#', label: 'Login' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.svg" alt="AMW Career Point" width={80} height={44} className="h-8 sm:h-9 w-auto" priority />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center gap-1 text-[13px] font-medium text-[#0D1B3E] hover:text-[#F26419] transition-colors">
                  {item.label}
                  {item.caret && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8.5L2.5 5h7L6 8.5z" /></svg>
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:+919929299268" className="text-[13px] font-medium text-[#0D1B3E]">
                <span className="font-bold text-[#F26419]">Call</span> +91-9929299268
              </a>
              <Link href="#counselling" className="h-9 px-5 rounded-full bg-[#F26419] text-white text-[13px] font-bold inline-flex items-center hover:bg-[#FF8040] transition-colors">
                Free Counselling
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-[#0D1B3E]" style={{ touchAction: 'manipulation' }}>
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5">
                <div className={`h-0.5 w-5 bg-current transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <div className={`h-0.5 w-5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`h-0.5 w-5 bg-current transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[48px] sm:top-[56px] z-40 bg-white border-b border-gray-200 shadow-md lg:hidden">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-[13px] font-medium text-[#0D1B3E] hover:bg-gray-50 rounded-lg">
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-100 space-y-1.5">
              <a href="tel:+919929299268" className="block px-3 py-2 text-[13px] font-medium text-[#0D1B3E]">
                <span className="font-bold text-[#F26419]">Call</span> +91-9929299268
              </a>
              <Link href="#counselling" onClick={() => setIsMenuOpen(false)} className="block text-center py-2 rounded-full bg-[#F26419] text-white text-[13px] font-bold">
                Free Counselling
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
