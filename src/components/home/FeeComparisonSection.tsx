export function FeeComparisonSection() {
  const feeComparison = [
    {
      country: "India (Private)",
      totalFees: "₹80-120 Lakhs",
      tuitionFee: "₹15-25 Lakhs/Year",
      livingCost: "₹2-4 Lakhs/Year",
      duration: "5.5 Years",
      pros: ["Home Country", "Family Support", "No Language Barrier"],
      cons: ["Very High Fees", "Donation Required", "Limited Seats"],
      color: "from-red-500 to-red-600"
    },
    {
      country: "Russia",
      totalFees: "₹15-25 Lakhs",
      tuitionFee: "₹2.5-4 Lakhs/Year",
      livingCost: "₹1.5-2.5 Lakhs/Year",
      duration: "6 Years",
      pros: ["WHO Approved", "No Donation", "Quality Education", "Low Cost"],
      cons: ["Language Learning", "Weather", "Cultural Adaptation"],
      color: "from-blue-500 to-blue-600",
      recommended: true
    },
    {
      country: "Uzbekistan", 
      totalFees: "₹12-18 Lakhs",
      tuitionFee: "₹2-3 Lakhs/Year",
      livingCost: "₹1-1.5 Lakhs/Year",
      duration: "6 Years",
      pros: ["Lowest Fees", "Indian Food", "Cultural Similarity", "Safe"],
      cons: ["New Destination", "Limited Universities"],
      color: "from-green-500 to-green-600"
    },
    {
      country: "Georgia",
      totalFees: "₹25-35 Lakhs", 
      tuitionFee: "₹4-6 Lakhs/Year",
      livingCost: "₹2-3 Lakhs/Year",
      duration: "6 Years",
      pros: ["European Standards", "English Medium", "EU Recognition"],
      cons: ["Higher Fees", "Competitive"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold mb-4">
            <span>💰</span>
            Fee Comparison
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Compare MBBS Fees Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make an informed decision by comparing total fees, living costs, and other factors 
            across different countries for MBBS education.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {feeComparison.map((item, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg border-2 hover:shadow-xl transition-shadow ${item.recommended ? 'border-blue-500' : 'border-gray-200'}`}>
              
              {/* Recommended Badge */}
              {item.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Preferred
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-r ${item.color} p-6 text-white rounded-t-2xl`}>
                <h3 className="text-2xl font-bold mb-2">{item.country}</h3>
                <div className="text-3xl font-bold">{item.totalFees}</div>
                <div className="text-sm opacity-90">Total Cost ({item.duration})</div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Fee Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tuition Fee</span>
                    <span className="font-semibold">{item.tuitionFee}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Living Cost</span>
                    <span className="font-semibold">{item.livingCost}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{item.duration}</span>
                  </div>
                </div>

                {/* Pros */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-green-700 mb-2">✓ Advantages:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {item.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-red-700 mb-2">⚠ Considerations:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {item.cons.map((con, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-red-500">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-medium transition-colors">
                  Get Detailed Info
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing the Right Option?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert counsellors will analyze your budget, NEET score, and preferences 
              to recommend the most suitable country and university for your MBBS journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold">
                Get Personalized Fee Analysis
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                Call: +91 98765 43210
              </button>
            </div>

            {/* Note */}
            <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <strong>Note:</strong> All fees are approximate and may vary based on university, 
              location, and current exchange rates. Consult our experts for updated and accurate fee structure.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}