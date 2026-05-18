import Link from 'next/link';

export function PredictorSection() {
  return (
    <section id="predictor" className="bg-[#0D1B3E] py-10 sm:py-14 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F26419]/20 border border-[#F26419]/40 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F26419] inline-block" />
            <span className="text-[#F26419] text-sm font-semibold">NEET UG 2025 · 21 States</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold">
            Find Your Perfect <span className="text-[#F26419]">Medical College</span>
          </h2>
          <p className="mt-3 text-[15px] text-gray-300 max-w-xl mx-auto">
            Enter your NEET 2025 rank and category to instantly see which MBBS colleges you can get admission in — powered by final cutoff data from 21 states.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/college-predictor"
            className="w-full sm:w-auto h-11 px-8 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors flex items-center justify-center"
          >
            Predict My College →
          </Link>
          <Link
            href="/college-predictor"
            className="w-full sm:w-auto h-11 px-8 rounded-full border border-white/30 text-white text-[13px] font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            View All State Cutoffs
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
          {[
            { value: '21', label: 'States' },
            { value: '4,000+', label: 'Cutoff Records' },
            { value: '2025', label: 'Final Data' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-[#F26419]">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}