export function FMGEPreparationSection() {
  return (
    <section className="bg-gradient-to-br from-red-50 to-orange-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            We Prepare You for FMGE / NExT Too
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Admission is only step one. To practice medicine in India after studying abroad,
            you must clear the Foreign Medical Graduate Examination (FMGE) — now being
            replaced by NExT. The national pass rate hovers around 45%. AMW prepares you from
            Day One of your MBBS so you're never caught off-guard.
          </p>
        </div>

        {/* FMGE Pass Rate Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">FMGE PASS RATE COMPARISON (2025)</h3>
            <p className="text-gray-600">
              AMW-guided students pass FMGE at nearly 1.6× the national average — 
              because we start coaching from Year 4 of the medical study not after graduation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 text-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold">78%</div>
              <div className="text-xs sm:text-sm">AMW Students</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">52%</div>
              <div className="text-xs sm:text-sm">Georgia Avg</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">50%</div>
              <div className="text-xs sm:text-sm">Uzbekistan</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">48%</div>
              <div className="text-xs sm:text-sm">Kazakhstan</div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-gray-500 to-gray-600 text-white p-4 sm:p-6 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">45%</div>
              <div className="text-xs sm:text-sm">Russia Avg</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-red-100">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">📚</div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              FMGE Coaching by the Middle of the Course
            </h3>
            <p className="text-gray-600">
              Subject-by-subject coaching aligned to the FMGE/NExT pattern starts in your 4th 
              year — not as a rushed crash course after graduation.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-blue-100">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">📝</div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Mock Test Series & Analytics
            </h3>
            <p className="text-gray-600">
              Weekly online mocks with performance analytics help you track weak subjects and
              improve systematically before the actual exam.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-green-100">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">👨‍🏫</div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              NExT-Ready Curriculum Mapping
            </h3>
            <p className="text-gray-600">
              As FMGE transitions to NExT, our curriculum is already aligned. Students guided
              by AMW won't encounter any surprises during the transition.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100">
            <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🏥</div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Internship Guidance (NMC 2021 Gazette Rule)
            </h3>
            <p className="text-gray-600">
              Under the 2021 NMC Gazette, your 1-year internship must be completed in India.
              We help you identify eligible hospitals and manage the application process.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <a 
            href="/contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            Learn About Our FMGE Programme →
          </a>
        </div>
      </div>
    </section>
  );
}