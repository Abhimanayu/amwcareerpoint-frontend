import Link from 'next/link';
import type { PublicFaqItem } from '@/lib/server/faqs';

interface FAQSectionProps {
  readonly faqs: PublicFaqItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">FAQ</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">Frequently Asked Questions</h2>
          <p className="mt-3 text-[15px] text-[#4A4742]">Honest answers to every question parents &amp; students ask.</p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-[#DDD9D2] overflow-hidden bg-white group">
              <summary className="w-full px-4 py-3 list-none cursor-pointer flex justify-between items-center bg-[#F9F8F6] hover:bg-[#f3f1ed] transition-colors">
                <span className="text-[13px] font-semibold text-[#0D1B3E] pr-4">{faq.question}</span>
                <span className="text-base text-[#F26419] shrink-0">+</span>
              </summary>
              <div className="px-4 py-3 bg-white border-t border-[#DDD9D2]">
                <p className="text-[13px] text-[#4A4742] leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-[13px] text-[#4A4742] mb-2.5">Still have questions?</p>
          <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center h-9 px-5 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors">
            Ask Our Experts →
          </Link>
        </div>
      </div>
    </section>
  );
}