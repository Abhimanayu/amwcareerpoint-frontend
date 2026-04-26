import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getCountrySlug } from '@/lib/slugUtils';

export function DestinationsSection() {
  const destinations = [
    {
      country: "Russia",
      flag: "🇷🇺",
      totalCost: "₹15-25 Lakhs",
      duration: "6 Years (5+1)",
      fmgePassRate: "85%",
      medium: "English/Russian",
      neetRange: "150-400",
      features: ["No Donation", "WHO Approved", "MCI Recognition", "Quality Education"],
      popularity: "Most Popular",
      universities: "50+ Universities"
    },
    {
      country: "Uzbekistan", 
      flag: "🇺🇿",
      totalCost: "₹12-18 Lakhs",
      duration: "6 Years (5+1)",
      fmgePassRate: "80%",
      medium: "English",
      neetRange: "120-350",
      features: ["Lowest Fees", "Indian Food", "Cultural Similarity", "Safe Environment"],
      popularity: "Budget Friendly",
      universities: "15+ Universities"
    },
    {
      country: "Kazakhstan",
      flag: "🇰🇿", 
      totalCost: "₹18-28 Lakhs",
      duration: "6 Years (5+1)",
      fmgePassRate: "82%",
      medium: "English/Russian",
      neetRange: "140-380",
      features: ["Developed Infrastructure", "Research Opportunities", "Scholarship Available", "Modern Facilities"],
      popularity: "Rising Star",
      universities: "12+ Universities"
    },
    {
      country: "Georgia",
      flag: "🇬🇪",
      totalCost: "₹25-35 Lakhs", 
      duration: "6 Years (5+1)",
      fmgePassRate: "88%",
      medium: "English",
      neetRange: "200-450",
      features: ["European Standards", "Advanced Technology", "Clinical Training", "EU Recognition"],
      popularity: "Premium Choice",
      universities: "8+ Universities"
    },
    {
      country: "China",
      flag: "🇨🇳",
      totalCost: "₹20-30 Lakhs",
      duration: "6 Years (5+1)", 
      fmgePassRate: "75%",
      medium: "English/Chinese",
      neetRange: "180-420",
      features: ["Ancient Medicine", "Modern Technology", "Research Focus", "Internship Opportunities"],
      popularity: "Traditional",
      universities: "45+ Universities"
    },
    {
      country: "Kyrgyzstan",
      flag: "🇰🇬",
      totalCost: "₹16-24 Lakhs",
      duration: "6 Years (5+1)",
      fmgePassRate: "78%", 
      medium: "English/Russian",
      neetRange: "130-360",
      features: ["Mountain Climate", "Peaceful Environment", "Affordable Living", "Good Infrastructure"],
      popularity: "Hidden Gem",
      universities: "10+ Universities"
    }
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold mb-4">
            <span>🌍</span>
            MBBS Destinations
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Choose Your Perfect Study Destination
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Compare top MBBS destinations with detailed cost analysis, FMGE pass rates, 
            and admission requirements to make an informed choice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-2xl sm:text-4xl shrink-0">{destination.flag}</span>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold truncate">{destination.country}</h3>
                      <p className="text-blue-100 text-sm">{destination.universities}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    {destination.popularity}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-base sm:text-2xl font-bold text-green-600">{destination.totalCost}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-base sm:text-2xl font-bold text-blue-600">{destination.fmgePassRate}</div>
                    <div className="text-xs sm:text-sm text-gray-600">FMGE Pass Rate</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{destination.duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Medium</span>
                    <span className="font-semibold">{destination.medium}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">NEET Range</span>
                    <span className="font-semibold text-blue-600">{destination.neetRange}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Key Features:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {destination.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link href={`/countries/${getCountrySlug(destination.country)}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Universities
                    </Button>
                  </Link>
                  <button className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg font-medium transition-colors">
                    Get Country Guide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-blue-100">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Confused About Which Country to Choose?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert counsellors will analyze your NEET score, budget, and preferences 
              to recommend the perfect destination for your MBBS journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Get Country Recommendation
              </Button>
              <Link href="/countries">
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3"
                >
                  Compare All Countries
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}