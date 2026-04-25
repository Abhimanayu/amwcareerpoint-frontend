'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SafeImage } from '../ui/SafeImage';
import { getCountries } from '@/lib/countries';
import { extractCollectionData } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

type DropdownItem = { href: string; label: string };

type MenuItem = {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
};

const staticMenuItems: MenuItem[] = [
  { href: '/', label: 'Home' },
  { href: '/countries/india', label: 'MBBS India' },
  {
    href: '/countries',
    label: 'MBBS Abroad',
    dropdown: [], // populated dynamically
  },
  { href: '#', label: 'College Predictor' },
  { href: '/blogs', label: 'Blog' },
  { href: '#', label: 'Login' },
];

const HEADER_COUNTRY_LIMIT = 5;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(staticMenuItems);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch countries for MBBS Abroad dropdown
  useEffect(() => {
    getCountries({ limit: HEADER_COUNTRY_LIMIT })
      .then((res) => {
        const countries = extractCollectionData<any>(res, ['countries']);
        if (countries.length > 0) {
          const countryLinks: DropdownItem[] = countries
            .filter((c: any) => c.slug && c.name)
            .slice(0, HEADER_COUNTRY_LIMIT)
            .map((c: any) => ({ href: `/countries/${c.slug}`, label: c.name }));
          setMenuItems((prev) =>
            prev.map((item) =>
              item.label === 'MBBS Abroad' ? { ...item, dropdown: countryLinks } : item
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 sm:h-14 items-center justify-between">
            <Link href="/" className="flex items-center shrink-0">
              <SafeImage 
                src="/logo.svg" 
                alt="AMW Career Point"
                width={120}
                height={36}
                priority
                style={{ height: '36px', width: 'auto' }}
                fallbackElement={
                  <div className="h-9 px-4 bg-[#0D1B3E] text-white rounded flex items-center text-sm font-bold">
                    AMW
                  </div>
                }
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-5" ref={dropdownRef}>
              {menuItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="flex items-center gap-1 text-[13px] font-medium text-[#0D1B3E] hover:text-[#F26419] transition-colors whitespace-nowrap"
                    >
                      {item.label}
                      <svg className={`h-3 w-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor"><path d="M6 8.5L2.5 5h7L6 8.5z" /></svg>
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute left-0 top-full pt-2 z-50">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-lg py-2 min-w-[200px] max-h-[70vh] overflow-y-auto">
                          {item.dropdown.length > 0 ? (
                            item.dropdown.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#0D1B3E] hover:bg-gray-50 hover:text-[#F26419] transition-colors"
                              >
                                <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 bg-current" />
                                <span>{sub.label}</span>
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-xs text-gray-400">Loading countries…</div>
                          )}
                          <Link
                            href={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2 text-[13px] font-semibold text-[#F26419] hover:bg-gray-50 border-t border-gray-100 mt-1"
                          >
                            View All Countries →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.label} href={item.href} className="flex items-center gap-1 text-[13px] font-medium text-[#0D1B3E] hover:text-[#F26419] transition-colors whitespace-nowrap">
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="hidden xl:flex items-center gap-4">
              <a href="tel:+919929299268" className="text-[13px] font-medium text-[#0D1B3E] whitespace-nowrap">
                <span className="font-bold text-[#F26419]">Call</span> +91-9929299268
              </a>
              <Link href="#counselling" className="h-9 px-5 rounded-full bg-[#F26419] text-white text-[13px] font-bold inline-flex items-center hover:bg-[#FF8040] transition-colors whitespace-nowrap">
                Free Counselling
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-2.5 -mr-2 text-[#0D1B3E]" style={{ touchAction: 'manipulation' }}>
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
        <div className="fixed inset-x-0 top-[48px] sm:top-[56px] z-40 bg-white border-b border-gray-200 shadow-md xl:hidden max-h-[calc(100vh-56px)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {menuItems.map((item) =>
              item.dropdown ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-[#0D1B3E] hover:bg-gray-50 rounded-lg"
                  >
                    {item.label}
                    <svg className={`h-3.5 w-3.5 transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor"><path d="M6 8.5L2.5 5h7L6 8.5z" /></svg>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-3 border-l-2 border-[#F26419]/20 pl-3 space-y-0.5 mb-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => { setIsMenuOpen(false); setMobileExpanded(null); }}
                          className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#0D1B3E] hover:bg-gray-50 hover:text-[#F26419] rounded-lg"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 bg-current" />
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                      <Link
                        href={item.href}
                        onClick={() => { setIsMenuOpen(false); setMobileExpanded(null); }}
                        className="block px-3 py-2 text-[13px] font-semibold text-[#F26419] hover:bg-gray-50 rounded-lg border-t border-gray-100 mt-1"
                      >
                        View All Countries →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-[#0D1B3E] hover:bg-gray-50 rounded-lg">
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 mt-2 border-t border-gray-100 space-y-1.5">
              <a href="tel:+919929299268" className="block px-3 py-2.5 text-sm font-medium text-[#0D1B3E]">
                <span className="font-bold text-[#F26419]">Call</span> +91-9929299268
              </a>
              <Link href="#counselling" onClick={() => setIsMenuOpen(false)} className="block text-center py-3 rounded-full bg-[#F26419] text-white text-sm font-bold">
                Free Counselling
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
