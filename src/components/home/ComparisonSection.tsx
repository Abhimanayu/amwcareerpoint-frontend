import Link from 'next/link';

export function ComparisonSection() {
  const rows = [
    { factor: 'Admission Process', india: 'NEET + Counselling + High Cutoff', abroad: 'Direct Admission + Simple Process' },
    { factor: 'Annual Fees', india: '₹15–25L (Govt) / ₹50L+ (Pvt)', abroad: '₹2.5–8 Lakhs' },
    { factor: 'Donation', india: '₹50L – 2 Crores', abroad: 'No Donation Required' },
    { factor: 'Seat Availability', india: 'Limited – High Competition', abroad: 'Ample Seats Available' },
    { factor: 'Recognition', india: 'NMC Approved', abroad: 'WHO & NMC Approved' },
    { factor: 'Infrastructure', india: 'Varies (Govt Good, Pvt Mixed)', abroad: 'World-Class Infrastructure' },
    { factor: 'Clinical Exposure', india: 'Limited in Pvt Colleges', abroad: 'Excellent Clinical Training' },
    { factor: 'Total Investment', india: '₹80L – 3 Crores', abroad: '₹15L – 50L' },
  ];

  return (
    <section className="bg-[#F9F8F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Compare Options</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">MBBS in India vs Abroad</h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-[#4A4742] max-w-2xl mx-auto">
            A clear comparison to help you make an informed decision about your medical career.
          </p>
        </div>

        {/* Mobile card layout */}
        <div className="sm:hidden space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="rounded-xl border border-[#DDD9D2] bg-white overflow-hidden">
              <div className="bg-[#0D1B3E] px-3.5 py-2 text-[12px] font-bold text-white">{r.factor}</div>
              <div className="px-3.5 py-2.5 space-y-1.5">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#4A4742]">India</span>
                  <p className="text-[12px] text-[#4A4742]">{r.india}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#F26419]">Abroad</span>
                  <p className="text-[12px] font-medium text-[#0D1B3E]">{r.abroad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#DDD9D2]">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="bg-[#0D1B3E] text-white px-4 py-2.5 text-left text-[13px] font-bold">Factor</th>
                <th className="bg-[#0D1B3E] text-white px-4 py-2.5 text-left text-[13px] font-bold border-l border-[#162550]">MBBS in India</th>
                <th className="bg-[#F26419] text-white px-4 py-2.5 text-left text-[13px] font-bold">MBBS Abroad</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9F8F6]'}>
                  <td className="px-4 py-2.5 font-semibold text-[13px] text-[#0D1B3E] border-r border-[#DDD9D2]">{r.factor}</td>
                  <td className="px-4 py-2.5 text-[13px] text-[#4A4742] border-r border-[#DDD9D2]">{r.india}</td>
                  <td className="px-4 py-2.5 text-[13px] text-[#4A4742]">{r.abroad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 sm:mt-6 rounded-xl border border-green-200 bg-green-50 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-heading text-[14px] sm:text-[15px] font-bold text-[#0D1B3E] mb-0.5">💡 Expert Recommendation</h3>
            <p className="text-[12px] sm:text-[13px] text-[#4A4742]">MBBS abroad offers better value and easier admission at a fraction of the cost of Indian private colleges.</p>
          </div>
          <Link href="#counselling" className="shrink-0 w-full sm:w-auto h-10 px-6 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold inline-flex items-center justify-center hover:bg-[#FF8040] transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}