import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with AMW Career Point for expert MBBS abroad consultancy. Contact us for free consultation and guidance.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            Get In Touch
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold text-white leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-[15px] text-white/70 max-w-3xl mx-auto">
            Ready to start your medical journey? Get in touch with our expert consultants
          </p>
        </div>
      </section>

      {/* ── Contact Content ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div>
              <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
                Free Guidance
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E] mb-2">
                Get Free Consultation
              </h2>
              <p className="text-[15px] text-[#4A4742] mb-6">
                Fill out the form below and our expert consultants will get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
                Reach Us
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E] mb-6">
                Get In Touch
              </h2>

              <div className="space-y-5 mb-8">
                {[
                  { icon: '📍', title: 'Address', content: 'D 100 A, Supreme Complex,\nMeera Marg, Bani Park,\nJaipur, Rajasthan 302006' },
                  { icon: '📞', title: 'Phone', content: '+91 9929299268', href: 'tel:+919929299268' },
                  { icon: '✉️', title: 'Email', content: 'support@amwcareerpoint.com', href: 'mailto:support@amwcareerpoint.com' },
                  { icon: '🕒', title: 'Office Hours', content: 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: Closed' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#F26419]/10 rounded-xl flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold text-[#0D1B3E] mb-0.5">{item.title}</h3>
                      {item.href ? (
                        <a href={item.href} className="text-[13px] text-[#4A4742] hover:text-[#F26419] transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-[13px] text-[#4A4742] whitespace-pre-line">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#DDD9D2] bg-white p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-heading text-base font-bold text-[#0D1B3E] mb-1">WhatsApp</h3>
                  <p className="text-[13px] text-[#4A4742] mb-3">Chat with us instantly</p>
                  <a
                    href="https://wa.me/919929299268"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center h-10 rounded-full border-2 border-[#0D1B3E] text-[#0D1B3E] text-[13px] font-bold hover:bg-[#0D1B3E] hover:text-white transition-colors"
                  >
                    Chat Now
                  </a>
                </div>
                <div className="rounded-xl border border-[#DDD9D2] bg-white p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-heading text-base font-bold text-[#0D1B3E] mb-1">Schedule Call</h3>
                  <p className="text-[13px] text-[#4A4742] mb-3">Book a consultation call</p>
                  <a
                    href="tel:+919929299268"
                    className="inline-flex w-full items-center justify-center h-10 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors"
                  >
                    Book Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-10 sm:py-14 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
              Common Questions
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-[#4A4742]">
              Quick answers to common questions about MBBS abroad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'What is the admission process?', a: 'The admission process typically involves NEET qualification, document submission, university selection, and visa processing. We guide you through each step.' },
              { q: 'What are the fees involved?', a: 'Tuition fees vary by country and university, typically ranging from $3,000-$8,000 per year. We help you choose affordable options that fit your budget.' },
              { q: 'Is NEET mandatory?', a: 'Yes, NEET qualification is mandatory for Indian students to study MBBS abroad and to practice medicine in India after graduation.' },
              { q: 'How long does the process take?', a: 'The complete process from application to visa usually takes 2-4 months. We ensure timely processing of all documents and procedures.' },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-[#DDD9D2] bg-white p-5 hover:shadow-md transition-shadow">
                <h3 className="font-heading text-base font-bold text-[#0D1B3E] mb-2">{faq.q}</h3>
                <p className="text-[13px] text-[#4A4742] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            Start Now
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Ready to Begin Your MBBS Journey?
          </h2>
          <p className="text-[15px] text-white/70 max-w-2xl mx-auto mb-8">
            Our expert counsellors are here to help you every step of the way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/countries"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
            >
              Explore Countries
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-white text-white text-[13px] sm:text-sm font-bold hover:bg-white hover:text-[#0D1B3E] transition-colors"
            >
              Browse Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
