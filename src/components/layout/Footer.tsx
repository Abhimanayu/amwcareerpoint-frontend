import Link from 'next/link';
import { getCurrentYear } from '@/lib/utils';

export function Footer() {
  const year = getCurrentYear();

  const destinations = ['Russia', 'Ukraine', 'Georgia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan'];

  return (
    <footer className="bg-[#0A1128] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-heading text-base font-bold text-white mb-2">
              <span className="text-orange">AMW</span> Career Point
            </div>
            <p className="text-xs leading-relaxed text-gray-400 mb-3">
              India&apos;s most trusted MBBS consultancy since 2009. Helping NEET aspirants secure admissions in top NMC-approved medical colleges.
            </p>
            <div className="space-y-1 text-xs">
              <a href="tel:+919929299268" className="block hover:text-white transition-colors">+91-9929299268</a>
              <a href="mailto:support@amwcareerpoint.com" className="block hover:text-white transition-colors">support@amwcareerpoint.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Quick Links</h4>
            <ul className="space-y-0.5 text-xs">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/universities', label: 'Universities' },
                { href: '/blogs', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">MBBS Destinations</h4>
            <ul className="space-y-0.5 text-xs">
              {destinations.map((c, idx) => (
                <li key={`${idx}-${c}`}>
                  <Link href={`/countries/${c.toLowerCase()}`} className="inline-block py-1 hover:text-white transition-colors">MBBS in {c}</Link>
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
              Jaipur, Rajasthan 302006
            </p>
            <p className="text-xs text-gray-400">Mon–Sat, 9 AM – 7 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-[11px] text-gray-500">
          <span>© {year} AMW Career Point. All rights reserved.</span>
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