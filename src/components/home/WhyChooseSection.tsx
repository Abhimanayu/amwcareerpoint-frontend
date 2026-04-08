export function WhyChooseSection() {
  const features = [
    {
      title: 'Zero Commission Model',
      desc: 'We don\'t receive commissions from universities. We recommend what\'s genuinely best for you — not what pays us the highest fee.',
      icon: '🚫',
    },
    {
      title: 'Founded by Doctors',
      desc: 'Both founders hold MBBS degrees and built AMW after navigating the system firsthand. Every decision is reviewed by medical professionals.',
      icon: '👨‍⚕️',
    },
    {
      title: 'No Hidden Fees — Ever',
      desc: 'Every cost is disclosed upfront in writing before you pay a single rupee. No surprises, no add-ons after you sign.',
      icon: '📋',
    },
    {
      title: 'NMC-Verified Colleges Only',
      desc: 'We only recommend universities that follow NMC norms with globally valid degrees. Updated with every NMC gazette.',
      icon: '✅',
    },
    {
      title: 'Support for All 6 Years',
      desc: 'AMW assigns you a dedicated support team for your entire degree — hostel issues, academic guidance, and placement assistance.',
      icon: '🤝',
    },
    {
      title: '2-Hour Response Guarantee',
      desc: 'Every enquiry gets a callback within 2 hours. Counsellors reachable Mon–Sat 9 AM to 6 PM, with emergency support beyond.',
      icon: '⚡',
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Why AMW Over Others?</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">What Makes Us Different</h2>
          <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
            We&apos;re not just another consultancy — from day one to graduation, your success is our mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((f, i) => (
            <div key={i} className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5 hover:shadow-md transition-shadow">
              <span className="text-xl mb-2.5 block">{f.icon}</span>
              <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E] mb-1.5">{f.title}</h3>
              <p className="text-[13px] leading-relaxed text-[#4A4742]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}