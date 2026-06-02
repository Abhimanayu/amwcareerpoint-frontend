import Link from 'next/link';
import { getCurrentYear } from '@/lib/utils';
import { getMbbsDestinationLinks } from '@/lib/mbbsDestinations';

const officeAddress = 'D 100 A, Supreme Complex, Meera Marg, Bani Park, Jaipur, Rajasthan 302016';
const encodedOfficeAddress = encodeURIComponent(officeAddress);

export function Footer() {
  const year = getCurrentYear();
  const destinations = getMbbsDestinationLinks();

  return (
    <footer className="bg-[#0A1128] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-heading text-base font-bold text-white mb-2">
              <span className="text-orange">AMW</span> Career Point
            </div>
            <p className="text-xs leading-relaxed text-gray-400 mb-3">
              India&apos;s most trusted MBBS consultancy since 2009. Helping NEET aspirants secure admissions in top NMC-approved medical colleges.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Quick Links</h4>
            <ul className="space-y-0.5 text-xs">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/college', label: 'Colleges' },
                { href: '/blogs', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 min-w-11 items-center py-1 px-1 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">MBBS Destinations</h4>
            <ul className="space-y-0.5 text-xs">
              {destinations.map((destination) => (
                <li key={destination.country}>
                  <Link href={destination.href} className="inline-flex min-h-11 min-w-11 items-center py-1 px-1 hover:text-white transition-colors">{destination.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Office</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              D 100 A, Supreme Complex,<br />
              Meera Marg, Bani Park,<br />
              Jaipur, Rajasthan 302016
            </p>
            <div className="space-y-1 text-xs">
              <a href="tel:+919929299268" className="inline-flex min-h-11 w-full items-center py-1 hover:text-white transition-colors">+91-9929299268</a>
              <a href="mailto:support@amwcareerpoint.com" className="inline-flex min-h-11 w-full items-center py-1 hover:text-white transition-colors">support@amwcareerpoint.com</a>
            </div>
            <p className="text-xs text-gray-400">Mon-Sat, 9 AM - 7 PM</p>
          </div>

          {/* Map */}
          <div className="col-span-2 md:col-span-4 xl:col-span-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Find Us</h4>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <iframe
                title="AMW Career Point office location in Jaipur"
                src={`https://www.google.com/maps?q=${encodedOfficeAddress}&output=embed`}
                className="h-40 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodedOfficeAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold text-[#F26419] hover:text-[#FF8040] transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-[11px] text-gray-500">
          <span>(c) {year} AMW Career Point. All rights reserved.</span>
          <div className="flex gap-5">
            <span className="hover:text-gray-300 transition-colors cursor-pointer py-1">Privacy</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer py-1">Terms</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer py-1">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
