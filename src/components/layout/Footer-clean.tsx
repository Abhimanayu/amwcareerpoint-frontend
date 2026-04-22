import Link from 'next/link';
import { getCurrentYear } from '@/lib/utils';

export function Footer() {
  const currentYear = getCurrentYear();

  const countries = [
    'Russia', 'Ukraine', 'Georgia', 'Kazakhstan', 'Uzbekistan', 'China', 'Kyrgyzstan', 'Belarus'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold text-blue-400 mb-4">
              <span className="text-red-500">AMW</span> Career Point
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              India&apos;s most trusted MBBS consultancy since 2009. Helping
              NEET aspirants secure admissions in top government, private, and NMC-approved
              international medical colleges.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-blue-400">[Phone]</span>
                <a href="tel:+919929299268" className="text-gray-300 hover:text-white transition-colors">
                  +91-9929299268
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400">[Email]</span>
                <a href="mailto:support@amwcareerpoint.com" className="text-gray-300 hover:text-white transition-colors">
                  support@amwcareerpoint.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400">[WhatsApp]</span>
                <a href="https://wa.me/919929299268" className="text-gray-300 hover:text-white transition-colors">
                  WhatsApp Support
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">[Address]</span>
                <div className="text-gray-300">
                  D 100 A, Supreme Complex, Meera Marg,<br />
                  Bani Park, Jaipur, Rajasthan 302006, India
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400">[Hours]</span>
                <div className="text-gray-300">
                  Mon–Sat, 9 AM – 7 PM<br />
                  <span className="text-sm text-gray-400">We reply within 2 hours</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="button" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span className="text-white font-bold">f</span>
              </button>
              <button type="button" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors">
                <span className="text-white font-bold">t</span>
              </button>
              <button type="button" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                <span className="text-white font-bold">i</span>
              </button>
              <button type="button" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-white font-bold">in</span>
              </button>
              <button type="button" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                <span className="text-white font-bold">yt</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> Universities
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> Blog & News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> Contact Us
                </Link>
              </li>
              <li>
                <button type="button" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> College Predictor
                </button>
              </li>
              <li>
                <button type="button" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>→</span> Free Counselling
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">MBBS Destinations</h3>
            <ul className="space-y-3">
              {countries.map((country, idx) => (
                <li key={`${idx}-${country}`}>
                  <Link 
                    href={"/countries/" + country.toLowerCase()} 
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <span>[Globe]</span> MBBS in {country}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Trusted & Certified</h4>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>ISO 9001:2015 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Government Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>PBSA Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>BBB Accredited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">☆</span>
              <span>4.9/5 Google Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AMW Career Point. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-white transition-colors cursor-pointer">Refund Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Disclaimer</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            Disclaimer: AMW Career Point is an educational consultancy service. We do not guarantee admissions. 
            All information is subject to change. Please verify details independently.
          </div>
        </div>
      </div>
    </footer>
  );
}