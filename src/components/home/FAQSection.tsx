"use client";
import { useState } from 'react';
import Link from 'next/link';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: 'Are foreign MBBS degrees valid in India?', a: 'Yes, MBBS degrees from NMC-approved universities are valid. You must clear FMGE/NExT to practise in India. AMW only partners with NMC-approved universities.' },
    { q: 'How much does MBBS in Russia cost?', a: 'Total cost ranges from ₹20–35 lakhs for the complete 6-year program including tuition, hostel, and living expenses — far less than Indian private colleges.' },
    { q: 'Do I need to know Russian?', a: 'No. Most universities offer English-medium MBBS programs. Learning basic Russian helps with clinical rotations but is not required.' },
    { q: 'What is the FMGE pass rate for AMW students?', a: 'AMW students have a 78% FMGE pass rate — nearly 1.6× higher than the national average. We start prep from the 4th year.' },
    { q: 'How does the admission process work?', a: '1) Share your NEET score, 2) We present matched college options, 3) We handle docs, applications & visa, 4) Support throughout your 6-year journey.' },
    { q: 'Can I visit home during the year?', a: 'Yes — most universities have winter and summer breaks. Typically 2–3 months vacation per year.' },
  ];

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">FAQ</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">Frequently Asked Questions</h2>
          <p className="mt-3 text-[15px] text-[#4A4742]">Honest answers to every question parents &amp; students ask.</p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-[#DDD9D2] overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-4 py-3 text-left flex justify-between items-center bg-[#F9F8F6] hover:bg-[#f3f1ed] transition-colors">
                <span className="text-[13px] font-semibold text-[#0D1B3E] pr-4">{faq.q}</span>
                <span className="text-base text-[#F26419] shrink-0">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className="px-4 py-3 bg-white border-t border-[#DDD9D2]">
                  <p className="text-[13px] text-[#4A4742] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
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