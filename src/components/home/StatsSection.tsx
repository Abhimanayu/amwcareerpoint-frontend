export function StatsSection() {
  const stats = [
    {
      number: '18,500+',
      label: 'Students Guided',
      sublabel: 'Across India & abroad',
      icon: 'ST',
    },
    {
      number: '12+',
      label: 'Years Of Trust',
      sublabel: 'Experienced counselling team',
      icon: 'YR',
    },
    {
      number: '4.9/5',
      label: 'Student Rating',
      sublabel: 'Consistent parent confidence',
      icon: 'RT',
    },
    {
      number: '25+',
      label: 'Top Destinations',
      sublabel: 'India plus global options',
      icon: 'CT',
    }
  ];

  return (
    <section className="bg-[#f3f5f9] pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-[#102a5c] px-5 py-6 shadow-[0_20px_60px_rgba(16,42,92,0.22)] sm:px-6 lg:-mt-3 lg:px-8">
          <div className="mb-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9fb0d5]">
              Our Track Record
            </p>
            <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              These Numbers Speak Of Our Success Story
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-[#17356f] px-4 py-5 text-center text-white"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0c214b] text-[11px] font-extrabold tracking-[0.16em] text-[#ffb16f] ring-1 ring-white/10">
                  {stat.icon}
                </div>
                <div className="mb-1 text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-[2rem]">{stat.number}</div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-200 sm:text-[13px]">{stat.label}</div>
                <div className="mt-2 text-[11px] leading-5 text-slate-300 sm:text-xs">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
