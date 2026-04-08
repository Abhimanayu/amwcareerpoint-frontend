export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Counselling & Application',
      desc: 'Free counselling based on your NEET score. We help you pick the right university and complete the application with all documents.',
      items: ['Free Counselling', 'University Selection', 'Application Help', 'Document Prep'],
    },
    {
      num: '02',
      title: 'Documentation & Visa',
      desc: 'Complete document preparation, visa application, and embassy support. 99% visa success rate.',
      items: ['Doc Verification', 'Visa Application', 'Embassy Support', 'Travel Assist'],
    },
    {
      num: '03',
      title: 'Support Throughout Studies',
      desc: 'Continuous support during your entire 6-year journey — arrival assistance, academic guidance, and more.',
      items: ['Airport Pickup', 'Accommodation', 'Academic Guidance', '24/7 Support'],
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Simple Process</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">Your MBBS Journey in 3 Steps</h2>
          <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
            From counselling to graduation — we handle everything so you can focus on your studies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-xl border border-[#DDD9D2] bg-[#F9F8F6] p-5 pt-9">
              <span className="absolute -top-3.5 left-5 w-8 h-8 rounded-full bg-[#F26419] text-white text-[13px] font-bold flex items-center justify-center">{s.num}</span>
              <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E] mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-[#4A4742] leading-relaxed mb-3">{s.desc}</p>
              <ul className="space-y-1.5">
                {s.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-[13px] text-[#4A4742]">
                    <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}