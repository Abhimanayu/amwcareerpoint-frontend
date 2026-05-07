export function WhyChooseSection() {
  const features = [
    {
      title: "Transparent Commission Model",
      subtitle: "We Don't Get Paid by Universities. We Get Paid by You.",
      desc: "Every consultancy that takes university commissions has a conflict of interest and won't admit it, but the university paying the highest fee gets recommended first. We don't take a single rupee from any university. What we recommend is what's genuinely right for your NEET score, budget, and career goal.",
      icon: "\u{1F6AB}",
    },
    {
      title: "Founded by Doctors",
      subtitle: "Built by People Who Have Actually Been There and Done That.",
      desc: "Our founders didn't stumble into education consulting. They are FMG Graduates who went through the same system and founded AMW specifically after their own MBBS abroad journey because they saw how badly students were being misguided. Every major recommendation of ours goes through a medically qualified lens, not as a sales tactic.",
      icon: "\u{1F468}\u200D\u2695\uFE0F",
    },
    {
      title: "No Hidden Fees -- Ever",
      subtitle: "The Number We Quote Is the Number You Pay.",
      desc: "Before you sign anything, we put every cost in writing, including tuition, hostel, visa, documentation, and everything else. No processing charges surfacing after you have committed. No add-ons once you've paid. If a cost isn't in your written breakdown, you don't pay it. It is as simple as that.",
      icon: "\u{1F4CB}",
    },
    {
      title: "Globally Valid Degree",
      subtitle: "Your Degree Has to Work When You Come Home.",
      desc: "A globally accredited MBBS degree with WHO-WFME, WDOMS, ECFMG, AMSE, AMC, EFMD, AACSB, AMBA, MCC, IEA, and NMC-approved university. That is six years and several lakhs spent on a certificate you can't use in India. We track every NMC gazette update and drop any university the moment compliance becomes uncertain. We'd rather lose a placement than send you to the wrong university.",
      icon: "\u2705",
    },
    {
      title: "Support for All 1st Years to Completion of Course",
      subtitle: "We Don't Disappear After You Board the Flight.",
      desc: "Most consultancies are done with you the moment your admission letter arrives. We assign you a dedicated support contact for your entire degree, covering hostel disputes, university paperwork, academic issues, visa renewals, and pre-final-year licensing guidance. Six years is a long time. We're here for all of it.",
      icon: "\u{1F91D}",
    },
    {
      title: "2-Hour Response Guarantee",
      subtitle: "Because Anxiety and a Great Idea Don't Wait for Business Hours.",
      desc: "When you're sitting in a foreign country with a problem, a 24-hour callback window feels like forever. Every enquiry at AMW gets a response within 2 hours. Our counsellors are reachable Monday to Saturday, 9 AM to 6 PM, and for genuine emergencies, we don't hide behind office hours.",
      icon: "\u26A1",
    },
  ];

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Why AMW Consultancy over others?</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">What Makes us Stand Out</h2>
          <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
            Most consultancies tell you what you want to hear. We&apos;d rather tell you what you need to know, even if it&apos;s uncomfortable. That&apos;s why students and parents come back to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((f, i) => (
            <div key={i} className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5 hover:shadow-md transition-shadow">
              <span className="text-xl mb-2.5 block">{f.icon}</span>
              <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E] mb-1.5">{f.title}</h3>
              <p className="text-[13px] font-semibold leading-relaxed text-[#0D1B3E] mb-2">{f.subtitle}</p>
              <p className="text-[13px] leading-relaxed text-[#4A4742]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
