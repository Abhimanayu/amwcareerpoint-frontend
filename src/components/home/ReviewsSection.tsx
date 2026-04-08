export function ReviewsSection() {
  const reviews = [
    { name: 'Sunita Agarwal', time: '2 weeks ago', text: 'Excellent service! My son got admission in a top Russian university. The team was available 24/7. Highly trustworthy.' },
    { name: 'Vikram Nair', time: '1 month ago', text: 'From document processing to visa — everything was managed perfectly. Dr. Rajesh\'s guidance was spot on.' },
    { name: 'Prathima Reddy', time: '3 weeks ago', text: 'Transparent, honest, and incredibly knowledgeable. No hidden fees, no surprises. 100% recommended.' },
  ];

  return (
    <section className="bg-[#F9F8F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Verified Reviews</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">What Parents &amp; Students Say</h2>
        </div>

        {/* Overall rating */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-xl border border-[#DDD9D2] bg-white px-4 sm:px-5 py-2.5 sm:py-3">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#F26419]">4.9</span>
            <span className="text-yellow-400 text-sm sm:text-base">★★★★★</span>
            <span className="text-[12px] sm:text-[13px] text-[#4A4742]">3,240+ Google Reviews</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0D1B3E] flex items-center justify-center text-white text-[11px] font-bold">
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#0D1B3E]">{r.name}</div>
                  <div className="text-[10px] text-[#4A4742]">{r.time}</div>
                </div>
              </div>
              <div className="text-yellow-400 text-[13px] mb-1.5">★★★★★</div>
              <p className="text-[13px] text-[#4A4742] leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}