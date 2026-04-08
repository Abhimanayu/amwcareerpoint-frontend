import Link from 'next/link';
import { CounsellingForm } from './CounsellingForm';

export function HeroSection() {
  return (
    <section className="bg-[#F9F8F6] py-6 sm:py-8 lg:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
          {/* Left content */}
          <div className="pt-0 lg:pt-4">
            <div className="max-w-[520px]">
              <span className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#F26419]">
                <span className="w-1.5 h-1.5 bg-[#F26419] rounded-full" />
                India&apos;s #1 Trusted Medical Consultancy
              </span>

              <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold leading-[1.15] sm:leading-[1.12] text-[#0D1B3E] mb-3 sm:mb-4">
                Your Trusted Partner for
                <span className="block text-[#F26419]">Medical Education</span>
                <span className="block">in India &amp; Abroad</span>
              </h1>

              <p className="text-[13px] sm:text-[14px] leading-[1.65] sm:leading-[1.7] text-[#4A4742] mb-4 sm:mb-5 max-w-md">
                At AMW Career Point, we&apos;ve guided over 20,000 students since 2009. From NEET counselling to foreign university admissions — we turn your medical dreams into reality.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                <Link href="#predictor" className="h-10 sm:h-11 px-6 sm:px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold inline-flex items-center justify-center hover:bg-[#FF8040] transition-colors">
                  Use College Predictor
                </Link>
                <Link href="#experts" className="h-10 sm:h-11 px-6 sm:px-7 rounded-full border-2 border-[#0D1B3E] text-[#0D1B3E] text-[13px] sm:text-sm font-bold inline-flex items-center justify-center hover:bg-[#0D1B3E] hover:text-white transition-colors">
                  Meet Our Experts
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-[#4A4742]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  NMC Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  20,000+ Students Placed
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  4.8/5 Google Rated
                </span>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="flex justify-center lg:justify-end">
            <CounsellingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
