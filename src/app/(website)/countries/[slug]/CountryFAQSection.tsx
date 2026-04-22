"use client";
import { useState } from "react";

interface CountryFAQSectionProps {
  faqs: { question: string; answer: string }[];
  countryName: string;
}

export function CountryFAQSection({ faqs, countryName }: CountryFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#F9F8F6] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">FAQ</span>
          <h3 className="text-xl font-heading font-bold text-[#0D1B3E]">
            Frequently Asked Questions about MBBS in {countryName}
          </h3>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-[#DDD9D2] overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 py-3.5 text-left flex justify-between items-center bg-white hover:bg-[#F9F8F6] transition-colors"
              >
                <span className="text-sm font-semibold text-[#0D1B3E] pr-4">{faq.question}</span>
                <span className={`flex-shrink-0 text-xl font-light text-[#F26419] transition-transform duration-200 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 bg-white border-t border-[#DDD9D2]">
                  <p className="text-sm text-[#4A4742] leading-relaxed pt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
