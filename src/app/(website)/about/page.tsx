import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about AMW Career Point - Your trusted partner for MBBS abroad consultancy with 10+ years of experience in medical education.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            Who We Are
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold text-white leading-tight mb-4">
            About AMW Career Point
          </h1>
          <p className="text-[15px] text-white/70 max-w-3xl mx-auto">
            Your trusted partner in achieving your dream of becoming a doctor through quality medical education abroad
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
                Our Journey
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-5">
                Our Story
              </h2>
              <div className="space-y-4 text-[15px] text-[#4A4742] leading-relaxed">
                <p>
                  Founded in 2009, AMW Career Point has been a pioneer in providing comprehensive consultancy services for students aspiring to pursue MBBS abroad. With over 15 years of experience, we have successfully guided thousands of students to achieve their dreams of becoming doctors.
                </p>
                <p>
                  Our journey began with a simple vision: to make quality medical education accessible and affordable for Indian students. Today, we are proud to be one of the most trusted names in medical education consultancy.
                </p>
                <p>
                  We understand that choosing the right university and country for your medical education is one of the most important decisions of your life. That&apos;s why we provide personalized guidance and support throughout your journey.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] p-6 sm:p-8">
              <h3 className="font-heading text-xl font-bold text-[#0D1B3E] mb-6">Our Achievements</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '20,000+', label: 'Students Placed' },
                  { value: '50+', label: 'Universities' },
                  { value: '15+', label: 'Countries' },
                  { value: '98%', label: 'Success Rate' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-[#F26419] mb-1">{stat.value}</div>
                    <div className="text-[13px] text-[#4A4742]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-10 sm:py-14 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
              What Drives Us
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-2">
              Our Values
            </h2>
            <p className="text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              The principles that guide us in helping students achieve their medical education goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Excellence', desc: 'We strive for excellence in every aspect of our service delivery', detail: 'From university selection to visa processing, we maintain the highest standards to ensure your success.' },
              { icon: '🤝', title: 'Integrity', desc: 'Transparency and honesty in all our interactions and processes', detail: 'We believe in building trust through transparent communication and ethical practices.' },
              { icon: '💡', title: 'Innovation', desc: 'Continuously improving our services with innovative solutions', detail: 'We leverage technology and innovative approaches to make your journey smoother and more efficient.' },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-[#DDD9D2] bg-white p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#F26419]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{v.icon}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#0D1B3E] mb-1">{v.title}</h3>
                <p className="text-[13px] text-[#4A4742] mb-3">{v.desc}</p>
                <p className="text-[13px] text-[#4A4742]/70">{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
              Meet The Experts
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-2">
              Our Expert Team
            </h2>
            <p className="text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              Meet the experienced professionals who will guide you through your medical education journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '👨‍⚕️', name: 'Dr. Rajesh Kumar', role: 'Founder & CEO', bio: 'MBBS, MD - 15 years experience in medical education consultancy' },
              { emoji: '👩‍💼', name: 'Ms. Priya Sharma', role: 'Head of Admissions', bio: 'MBA - 12 years experience in international admissions' },
              { emoji: '👨‍💻', name: 'Mr. Amit Patel', role: 'Visa Consultant', bio: 'LLB - 10 years experience in visa processing and documentation' },
            ].map((member) => (
              <div key={member.name} className="rounded-xl border border-[#DDD9D2] bg-white p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-[#F9F8F6] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">{member.emoji}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#0D1B3E] mb-1">{member.name}</h3>
                <p className="text-[#F26419] text-[13px] font-semibold mb-2">{member.role}</p>
                <p className="text-[13px] text-[#4A4742]">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission CTA ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            Our Purpose
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Our Mission
          </h2>
          <p className="text-[15px] text-white/70 max-w-3xl mx-auto mb-10">
            To bridge the gap between aspiring medical students and world-class medical education by providing expert guidance, comprehensive support, and personalized solutions that ensure success in their medical career journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Student-Centric Approach', desc: 'Every decision we make is focused on what\'s best for our students\' future' },
              { title: 'Quality Partnerships', desc: 'We partner only with accredited, WHO-approved medical universities' },
              { title: 'Long-term Support', desc: 'Our relationship continues throughout your academic journey and beyond' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-heading text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[13px] text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}