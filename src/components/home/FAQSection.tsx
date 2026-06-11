import Link from 'next/link';
import { FaqAnswer } from '@/components/common/FaqAnswer';
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

        <div className="space-y-3">
          {faqs.map((faq) => (
            <article key={faq.question} className="overflow-hidden rounded-xl border border-[#DDD9D2] bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-[#DDD9D2] bg-[#F9F8F6] px-5 py-4">
                <h3 className="text-sm font-semibold leading-relaxed text-[#0D1B3E]">{faq.question}</h3>
                <span className="shrink-0 text-lg font-light leading-none text-[#F26419]">+</span>
              </div>
              <div className="px-5 py-4">
                <FaqAnswer answer={faq.answer} className="text-sm leading-7 text-[#4A4742]" />
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <p className="text-[13px] text-[#4A4742] mb-2.5">Still have questions?</p>
          <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-5 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors">
            Ask Our Experts →
          </Link>
        </div>
      </div>
    </section>
  );
}
