export function PredictorSection() {
  return (
    <section id="predictor" className="bg-[#0D1B3E] py-10 sm:py-14 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold">
            Find Your Perfect <span className="text-[#F26419]">Medical College</span>
          </h2>
          <p className="mt-3 text-[15px] text-gray-300 max-w-xl mx-auto">
            Get personalized recommendations based on your NEET score, category &amp; preferences.
          </p>
        </div>

        <div className="text-center">
          <button className="w-full sm:w-auto h-10 px-8 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors">
            Predict College
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 max-w-md mx-auto text-center">
          <div>
            <div className="font-heading text-base sm:text-lg font-bold text-[#F26419]">⚡ Instant</div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Results in seconds</p>
          </div>
          <div>
            <div className="font-heading text-base sm:text-lg font-bold text-[#F26419]">🎯 95%</div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">Accuracy rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}