import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-[#0D1B3E] py-10 sm:py-14 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Limited Seats</span>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
          Don&apos;t Let Another Year <span className="text-[#F26419]">Slip Away</span>
        </h2>
        <p className="text-[13px] sm:text-[14px] text-gray-300 mb-5 sm:mb-6 max-w-xl mx-auto">
          MBBS admissions are closing soon. Secure your seat in top medical universities with our expert guidance. 25,000+ students already did.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
          <a href="tel:+919929299268" className="h-10 px-6 rounded-full bg-[#F26419] text-white text-[13px] font-bold inline-flex items-center justify-center hover:bg-[#FF8040] transition-colors w-full sm:w-auto">
            📞 Call Now
          </a>
          <Link href="#counselling" className="h-10 px-6 rounded-full border-2 border-white text-white text-[13px] font-bold inline-flex items-center justify-center hover:bg-white hover:text-[#0D1B3E] transition-colors w-full sm:w-auto">
            Get Free Counselling
          </Link>
        </div>
      </div>
    </section>
  );
}