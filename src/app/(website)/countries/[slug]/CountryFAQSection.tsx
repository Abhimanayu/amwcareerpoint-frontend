import { FaqAnswer } from '@/components/common/FaqAnswer';

interface CountryFAQSectionProps {
  faqs: { question: string; answer: string }[];
  countryName: string;
}

export function CountryFAQSection({ faqs, countryName }: CountryFAQSectionProps) {
  return (
    <section className="bg-[#F9F8F6] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">FAQ</span>
          <h3 className="text-xl font-heading font-bold text-[#0D1B3E]">
            Frequently Asked Questions about MBBS in {countryName}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <article key={`${faq.question}-${i}`} className="overflow-hidden rounded-xl border border-[#DDD9D2] bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-[#DDD9D2] bg-[#F9F8F6] px-5 py-4">
                <h4 className="text-sm font-semibold leading-relaxed text-[#0D1B3E]">{faq.question}</h4>
                <span className="shrink-0 text-lg font-light leading-none text-[#F26419]">+</span>
              </div>
              <div className="px-5 py-4">
                <FaqAnswer answer={faq.answer} className="text-sm leading-7 text-[#4A4742]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
