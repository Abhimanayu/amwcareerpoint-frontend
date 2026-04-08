'use client';

import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';

export function ExpertCounsellorsSection() {
  const counsellors = [
    {
      name: 'Manish Kataria',
      role: 'Private College Expert',
      rating: 5.0,
      students: '780+',
      bio: 'MBA in Education Management. 3 years of expertise in private medical college admissions across India. Specialist in management quota and NRI seat counselling.',
      spec: 'Management Quota',
    },
    {
      name: 'Dr Priti Thakur',
      role: 'Private College Expert',
      rating: 5.0,
      students: '780+',
      bio: 'MBA in Education Management. 12 years of expertise in private medical college admissions across India. Specialist in management quota and NRI seat counselling.',
      spec: 'Private Admissions',
    },
    {
      name: 'Brij Mohan Soni',
      role: 'MBBS Abroad College Expert',
      rating: 5.0,
      students: '780+',
      bio: 'MBA in Education Management. 6 years of expertise in private medical college admissions across India. Specialist in management quota and NRI seat counselling.',
      spec: 'Abroad Colleges',
    },
    {
      name: 'Dr. Niharika Singh',
      role: 'Private College Expert',
      rating: 5.0,
      students: '780+',
      bio: 'MBA in Education Management. 10 years of expertise in private medical college admissions across India. Specialist in management quota and NRI seat counselling.',
      spec: 'NRI Seat Counselling',
    },
    {
      name: 'Dr Yash Pal Singh',
      role: 'MBBS Abroad Specialist',
      rating: 5.0,
      students: '1,000+',
      bio: 'PhD in Medical Education. 12 years in MBBS abroad counselling. Expert in Russia, Uzbekistan & Central Asia admissions with end-to-end visa and documentation support.',
      spec: 'Russia & Central Asia',
    },
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Senior NEET Counsellor',
      rating: 5.0,
      students: '1,200+',
      bio: 'MBBS from AIIMS Delhi. 14+ years guiding NEET aspirants for government medical admissions. Specialist in state quota and All India Quota counselling.',
      spec: 'NEET & Govt. Quota',
    },
  ];

  return (
    <section id="experts" className="bg-[#F9F8F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Expert Counsellors</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">Meet Our Medical Education Experts</h2>
          <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
            Personalized guidance from professionals who&apos;ve helped 15,000+ students achieve their MBBS dreams.
          </p>
        </div>

        <div className="px-4 sm:px-5">
          <Carousel slideClass="basis-full sm:basis-1/2 lg:basis-1/3 pl-4 sm:pl-5">
            {counsellors.map((c, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[#DDD9D2] bg-white h-full flex flex-col">
                {/* Header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-full bg-teal-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {c.name.split(' ').filter(n => n !== 'Dr' && n !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E]">{c.name}</h3>
                      <p className="text-xs text-[#4A4742]">{c.role}</p>
                      <span className="text-[11px] text-green-600 font-medium">✅ Verified Expert</span>
                    </div>
                  </div>
                  <div className="text-[#F26419] text-sm mt-2 mb-2">★★★★★</div>
                  <p className="text-[13px] text-[#4A4742] leading-relaxed">{c.bio}</p>
                </div>
                {/* Stats + CTA */}
                <div className="px-5 pb-5 mt-auto">
                  <div className="flex items-center justify-between rounded-lg bg-[#F9F8F6] px-4 py-2.5 mb-3">
                    <div className="text-center">
                      <div className="text-[15px] font-bold text-[#0D1B3E]">{c.students}</div>
                      <div className="text-[10px] text-[#4A4742]">Students Guided</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[15px] font-bold text-[#0D1B3E]">{c.rating} ★</div>
                      <div className="text-[10px] text-[#4A4742]">Rating</div>
                    </div>
                  </div>
                  <Link href="#counselling" className="block w-full text-center py-2.5 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors">
                    Book Session
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}