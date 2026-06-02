'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';

const counsellors = [
  {
    name: 'Dr. Yashpal Singh',
    role: 'Senior Counselor - Study Abroad Guidance',
    rating: '4.8',
    students: '14+',
    statLabel: 'Years of Experience',
    image: '/experts/dr-yashpal.png',
    bio: 'Dr. Yashpal Singh is a highly experienced medical education advisor specializing in MBBS abroad counseling. Being an FMG himself and an Indian registered doctor, he brings firsthand experience and deep insight into international medical education. With years of expertise, he helps students choose the right university based on their budget, academic profile, and future career goals.',
    tags: ['MBBS Abroad Counseling', 'University Selection', 'Career Guidance', 'Admission Assistance'],
  },
  {
    name: 'Dr. Lalit Bhardwaj',
    role: 'Senior Counselor - Study India and Abroad Guidance',
    rating: '4.8',
    students: '15+ Years',
    statLabel: 'Experience',
    image: '/experts/dr-lalit-bhardwaj.png',
    bio: 'Dr. Lalit Bhardwaj is an FMG graduate, an Indian registered Sonologist Doctor, and a highly experienced medical education advisor with over 15 years of expertise in guiding medical aspirants for studies in India and abroad. He supports NEET counseling, private medical colleges, MBBS abroad opportunities, and long-term career planning.',
    tags: ['MBBS in India Guidance', 'NEET Counseling', 'College Selection', 'Parent Counseling'],
  },
  {
    name: 'Dr. Niharika Singh',
    role: 'Counselor',
    rating: '4.5',
    students: 'FMG Doctor',
    statLabel: 'Qualification',
    image: '/experts/dr-niharika-singh.png',
    bio: 'Dr. Niharika Singh is an FMG graduate, an Indian registered doctor, and a DGO specialist who helps students and parents understand the complete MBBS admission journey with clarity and confidence. Her friendly communication style and student-first approach make the process simple, transparent, and stress-free.',
    tags: ['Student Counseling', 'University Guidance', 'NEET Guidance', 'Admission Support'],
  },
  {
    name: 'Dr. Preeti Thakur',
    role: 'Counselor',
    rating: '4.5',
    students: 'FMG Doctor',
    statLabel: 'Qualification',
    image: '/experts/dr-preeti-thakur.png',
    bio: 'Dr. Preeti Thakur is an FMG graduate and an Indian registered doctor who assists students throughout their admission journey and helps them make informed career decisions. She provides step-by-step guidance for university applications, documentation, and the complete MBBS admission process.',
    tags: ['Personalized Counseling', 'Documentation Support', 'MBBS Career Planning', 'Student Assistance'],
  },
  {
    name: 'Brij Mohan Soni',
    role: 'Accounts & Documents Department',
    rating: '4.5',
    students: 'Documentation',
    statLabel: 'Department',
    image: '/experts/brij-mohan-soni.png',
    bio: 'Brij Mohan Soni manages the complete counseling and documentation process for students and parents. From initial counseling to document verification and application assistance, he ensures the entire admission experience remains smooth, reliable, and stress-free.',
    tags: ['Fee Transfer Guide', 'Documentation Support', 'Counselling', 'Admin Coordination'],
  },
  {
    name: 'Manish Katariya',
    role: 'Student Coordinator',
    rating: '4.5',
    students: 'Onboarding',
    statLabel: 'Specialization',
    image: '/experts/manish-katariya.png',
    bio: 'Manish Katariya works closely with students from admission to university onboarding. He helps students with travel coordination, hostel assistance, airport pickup arrangements, and continuous support during their MBBS journey.',
    tags: ['Student Coordination', 'Travel Assistance', 'Hostel Support', 'Student Support'],
  },
];

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ExpertCounsellorsSection() {
  return (
    <section id="experts" className="bg-[#F9F8F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Expert Counsellors</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">Meet Our Medical Education Experts</h2>
          <p className="mt-2 text-[15px] font-semibold text-[#0D1B3E]">Trusted Guidance for Your Medical Career Journey</p>
          <p className="mt-3 text-[15px] text-[#4A4742] max-w-3xl mx-auto">
            Personalized guidance from experienced professionals with 14+ years of experience helping students pursue MBBS in India and abroad through AMW Career Point.
          </p>
        </div>

        <div className="px-4 sm:px-5">
          <Carousel slideClass="basis-full sm:basis-1/2 lg:basis-1/3 pl-4 sm:pl-5">
            {counsellors.map((counsellor) => (
              <div key={counsellor.name} className="rounded-2xl overflow-hidden border border-[#DDD9D2] bg-white h-full flex flex-col shadow-sm">
                <div className="relative h-72 bg-[#F9F8F6]">
                  {counsellor.image ? (
                    <Image
                      src={counsellor.image}
                      alt={counsellor.name}
                      fill
                      sizes="(max-width: 768px) 150px, 250px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0D1B3E] text-white">
                      <span className="font-heading text-5xl font-bold">{getInitials(counsellor.name)}</span>
                    </div>
                  )}
                </div>

                <div className="px-5 pt-5 pb-4 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-[#0D1B3E]">{counsellor.name}</h3>
                      <p className="text-xs font-semibold text-[#F26419]">{counsellor.role}</p>
                      <span className="text-[11px] text-green-700 font-medium">Verified Expert</span>
                    </div>
                    <div className="rounded-full bg-[#FFF4EC] px-3 py-1 text-[11px] font-bold text-[#F26419] whitespace-nowrap">
                      {counsellor.rating}/5
                    </div>
                  </div>

                  <p className="text-[13px] text-[#4A4742] leading-relaxed">{counsellor.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {counsellor.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#DDD9D2] bg-[#F9F8F6] px-3 py-1 text-[10px] font-semibold text-[#0D1B3E]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5 mt-auto">
                  <div className="flex items-center justify-between rounded-lg bg-[#F9F8F6] px-4 py-2.5 mb-3">
                    <div className="text-center">
                      <div className="text-[15px] font-bold text-[#0D1B3E]">{counsellor.students}</div>
                      <div className="text-[10px] text-[#4A4742]">{counsellor.statLabel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[15px] font-bold text-[#0D1B3E]">{counsellor.rating}/5</div>
                      <div className="text-[10px] text-[#4A4742]">Rating</div>
                    </div>
                  </div>
                  <Link href="#counselling" className="block w-full min-h-11 text-center py-3 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors">
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
