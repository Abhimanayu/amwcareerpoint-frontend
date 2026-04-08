import Link from 'next/link';

export function DecisionGuideSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            India or Abroad — Which Is Right for You?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The honest breakdown most consultancies won't give you. Neither option is 
            universally better; it depends on your score, budget, and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* MBBS in India */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🇮🇳</span>
              <h3 className="text-2xl font-bold text-blue-600">MBBS in India</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Choose India If…</h4>
              <p className="text-sm text-gray-600 mb-4 italic">
                Government college or well-ranked private with a competitive NEET score
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">Your NEET score is 550+ (government) or 500+ (private)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You prefer to study and practice in the same regulatory environment</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">Government college is an option — unmatched value at ₹1–5 Lakhs total</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">Your family is more comfortable with a familiar setting</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">If the budget for private is 65-110 Lakhs and the NEET is below 550</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">If only management quota seats are available at very high capitation fees</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <span>📞</span>
              <span>Ask us which government colleges you qualify for</span>
            </div>
          </div>

          {/* MBBS Abroad */}
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🌍</span>
              <h3 className="text-2xl font-bold text-green-600">MBBS Abroad</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Choose Abroad If…</h4>
              <p className="text-sm text-gray-600 mb-4 italic">
                NMC-approved universities in Russia, Uzbekistan, Kazakhstan, Georgia, Kyrgyzstan, Europe, U.K
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">Your NEET score is 150-500, and government seats aren't within reach</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">Total budget is ₹15-40 Lakhs - significantly less than private India</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You're prepared to clear FMGE/NExT after returning to practice in India</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">You want English-medium education with strong clinical exposure</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">If you're unwilling to prepare seriously for FMGE - it's a real exam</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg">✗</span>
                  <span className="text-gray-700">If considering a non-NMC college just to save on fees</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-green-600 font-medium">
              <span>📞</span>
              <span>Book a free session — we'll tell you honestly which suits you</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Get a Personalised Recommendation →
          </Link>
        </div>
      </div>
    </section>
  );
}