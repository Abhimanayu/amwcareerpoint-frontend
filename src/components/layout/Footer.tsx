import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  const destinations = ['Russia', 'Ukraine', 'Georgia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan'];

  return (
    <footer className="bg-[#0A1128] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-heading text-base font-bold text-white mb-2">
              <span className="text-[#F26419]">AMW</span> Career Point
            </div>
            <p className="text-[11px] leading-relaxed text-gray-400 mb-3">
              India&apos;s most trusted MBBS consultancy since 2009. Helping NEET aspirants secure admissions in top NMC-approved medical colleges.
            </p>
            <div className="space-y-1 text-[11px]">
              <a href="tel:+919929299268" className="block hover:text-white transition-colors">+91-9929299268</a>
              <a href="mailto:support@amwcareerpoint.com" className="block hover:text-white transition-colors">support@amwcareerpoint.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2.5">Quick Links</h4>
            <ul className="space-y-1.5 text-[11px]">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/universities', label: 'Universities' },
                { href: '/blogs', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2.5">MBBS Destinations</h4>
            <ul className="space-y-1.5 text-[11px]">
              {destinations.map((c) => (
                <li key={c}>
                  <Link href={`/countries/${c.toLowerCase()}`} className="hover:text-white transition-colors">MBBS in {c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2.5">Office</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
              D 100 A, Supreme Complex,<br />
              Meera Marg, Bani Park,<br />
              Jaipur, Rajasthan 302006
            </p>
            <p className="text-[11px] text-gray-400">Mon–Sat, 9 AM – 7 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[10px] text-gray-500">
          <span>© {year} AMW Career Point. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}