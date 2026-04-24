'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CollegeHero } from '@/components/ui/CollegeHero';
import { CollegeGallery } from '@/components/ui/CollegeGallery';
import { FeeCard } from '@/components/ui/FeeCard';
import { SafeImage } from '@/components/ui/SafeImage';
import { pickUniversityImageSource } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'fees', label: 'Fees' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'campus', label: 'Campus' },
  { id: 'admission', label: 'Admission' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQs' },
];

const STATIC_REVIEWS = [
  { name: 'Priya Sharma', initials: 'PS', year: '3rd Year', text: 'The faculty here is incredibly supportive. The clinical training during hospital rotations has given me real confidence in patient care.', rating: 5 },
  { name: 'Rahul Patel', initials: 'RP', year: '5th Year', text: 'Affordable fees without compromising on quality. The campus facilities and hostel life made my transition abroad very smooth.', rating: 5 },
  { name: 'Ananya Gupta', initials: 'AG', year: '2nd Year', text: 'English medium instruction and WHO-recognized curriculum were the deciding factors for me. No regrets so far — excellent experience overall.', rating: 4 },
  { name: 'Vikram Singh', initials: 'VS', year: '4th Year', text: 'The university helped with everything from visa to accommodation. Hospital exposure from year three has been invaluable for my FMGE prep.', rating: 5 },
  { name: 'Sneha Reddy', initials: 'SR', year: '6th Year', text: 'Just cleared my licensing exam on the first attempt. The structured coaching and mock exams during final year were a game-changer.', rating: 5 },
  { name: 'Arjun Mehta', initials: 'AM', year: '3rd Year', text: 'Safe campus, good food options, and a strong Indian student community. The teaching methodology is very practical and hands-on.', rating: 4 },
];

const CURRICULUM = [
  { year: 'Year 1', title: 'Pre-Clinical Sciences', subjects: 'Anatomy, Histology, Biochemistry, Medical Biology', desc: 'Foundation of medical knowledge with lab sessions and introductory clinical exposure.' },
  { year: 'Year 2', title: 'Pre-Clinical + Pathology', subjects: 'Physiology, Microbiology, Pathology, Pharmacology', desc: 'Deeper understanding of human body systems and disease mechanisms.' },
  { year: 'Year 3', title: 'Clinical Sciences Begin', subjects: 'Internal Medicine, Surgery, Obstetrics & Gynaecology', desc: 'Hospital rotations begin. Students interact with patients under supervision.' },
  { year: 'Year 4', title: 'Advanced Clinical Training', subjects: 'Paediatrics, Neurology, Ophthalmology, ENT', desc: 'Specialized clinical postings across departments with case presentations.' },
  { year: 'Year 5', title: 'Sub-Internship', subjects: 'Psychiatry, Dermatology, Radiology, Emergency Medicine', desc: 'Students handle patient cases with increasing responsibility.' },
  { year: 'Year 6', title: 'Internship & Licensing Prep', subjects: 'Full-time clinical rotations, FMGE/NExT coaching', desc: 'Final year practical training and structured exam preparation.' },
];

export default function UniversityDetailClient({
  university,
  countryData,
  relatedUniversities,
  apiFaqs,
}: {
  university: any;
  countryData: any;
  relatedUniversities: any[];
  apiFaqs?: { question: string; answer: string }[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currTab, setCurrTab] = useState(0);

  const countryName = university.country?.name || '';
  const admissionProcess = Array.isArray(countryData?.admissionProcess) ? countryData.admissionProcess.slice(0, 10) : [];
  const highlights = Array.isArray(university.highlights) ? university.highlights.slice(0, 20) : [];
  const universityFaqs = Array.isArray(university.faqs) ? university.faqs.slice(0, 15) : [];
  const mergedApiFaqs = Array.isArray(apiFaqs) ? apiFaqs : [];
  const faqs = mergedApiFaqs.length > 0
    ? [...mergedApiFaqs, ...universityFaqs.filter((uf: any) => !mergedApiFaqs.some((af) => af.question === uf.question))].slice(0, 15)
    : universityFaqs;
  const gallery = Array.isArray(university.gallery) ? university.gallery.slice(0, 12) : [];
  const recognition = Array.isArray(university.recognition) ? university.recognition.slice(0, 10) : [];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [activeNav, setActiveNav] = useState('overview');

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">

      {/* ═══════════════ HERO — reusable protected component ═══════════════ */}
      <CollegeHero
        name={university.name}
        heroImage={university.heroImage}
        countryName={countryName}
        countryFlagImage={university.country?.flagImage}
        establishedYear={university.establishedYear}
        accreditation={university.accreditation}
        medium={university.medium}
        annualFees={university.annualFees}
        courseDuration={university.courseDuration}
        hostelFees={university.hostelFees}
      />

      {/* ═══════════════ STICKY NAV ═══════════════ */}
      <nav className="sticky top-0 z-30 border-b border-[#DDD9D2] bg-white shadow-sm">
        <div className="mx-auto max-w-[1200px] px-0 sm:px-8">
          <div className="relative flex gap-0 overflow-x-auto py-0 scrollbar-hide">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-white to-transparent sm:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-white to-transparent sm:hidden" />
            <div className="flex pl-4 pr-4 sm:pl-0 sm:pr-0">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveNav(item.id); scrollTo(item.id); }}
                  className={`cursor-pointer whitespace-nowrap border-b-2 px-3 py-3.5 text-[13px] font-medium transition-colors sm:px-5 sm:text-sm ${
                    activeNav === item.id
                      ? 'border-[#F26419] text-[#F26419]'
                      : 'border-transparent text-[#4A4742] hover:border-[#F26419] hover:text-[#F26419]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════ OVERVIEW — WHY STUDENTS CHOOSE ═══════════════ */}
      <section id="overview" className="bg-[#F9F8F6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
            {/* Left — content */}
            <div>
              <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
                Why students choose<br /><span className="font-normal italic">{university.name}</span>
              </h2>

              {university.description ? (
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#4A4742]">
                  {university.description.split('\n').filter(Boolean).map((p: string, i: number) => (
                    <p key={`desc-${i}`} className="break-words">{p}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-[15px] leading-relaxed text-[#4A4742]">
                  {university.name} offers world-class medical education with affordable fees, modern infrastructure,
                  and globally recognized degrees.
                </p>
              )}

              {/* Highlight pills */}
              {highlights.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {highlights.map((h: any, i: number) => (
                    <span key={`hl-${i}`} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#DDD9D2] bg-white px-4 py-2 text-sm text-[#0D1B3E]">
                      <span className="shrink-0 font-semibold text-[#F26419]">{h.label}</span>
                      {h.value && <span className="min-w-0 truncate text-[#4A4742]">— {h.value}</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Quick Facts card */}
            <div>
              <div className="sticky top-16 overflow-hidden rounded-2xl border border-[#DDD9D2] bg-white">
                <div className="bg-[#0D1B3E] px-6 py-4">
                  <h3 className="text-base font-semibold text-white">Quick Facts</h3>
                </div>
                <div className="space-y-0 p-5">
                  {[
                    countryName && { label: 'Location', value: countryName },
                    university.courseDuration && { label: 'Duration', value: university.courseDuration },
                    university.medium && { label: 'Medium', value: university.medium },
                    university.ranking && { label: 'Ranking', value: university.ranking },
                    university.accreditation && { label: 'Accreditation', value: university.accreditation },
                    university.eligibility && { label: 'Eligibility', value: university.eligibility },
                  ].filter(Boolean).map((item: any, i: number) => (
                    <div key={`qf-${i}`} className="flex items-start justify-between border-b border-[#DDD9D2]/50 py-3 last:border-0">
                      <span className="min-w-0 text-sm text-[#4A4742]">{item.label}</span>
                      <span className="min-w-0 max-w-[55%] break-words text-right text-sm font-semibold text-[#0D1B3E]">{item.value}</span>
                    </div>
                  ))}
                  {recognition.length > 0 && (
                    <div className="pt-3">
                      <span className="mb-2 block text-sm text-[#4A4742]">Recognition</span>
                      <div className="flex flex-wrap gap-1.5">
                        {recognition.map((r: string, i: number) => (
                          <span key={`rec-${i}`} className="rounded-md bg-[#0D1B3E] px-2.5 py-1 text-xs font-medium text-white">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-5">
                  <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-full bg-[#F26419] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040]">
                    Get Free Counselling
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEE STRUCTURE ═══════════════ */}
      <section id="fees" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
            Complete, transparent<br /><span className="font-normal italic text-[#F26419]">cost breakdown</span>
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-[#4A4742]">
            No hidden charges, no donation. The full picture of costs at {university.name}.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            <FeeCard label="Tuition Fee" value={university.annualFees || 'Contact Us'} sub="/year" accent />
            <FeeCard label="Hostel Fee" value={university.hostelFees || 'Contact Us'} sub="/year" />
            <FeeCard label="Food & Meals" value="$100–1L" sub="/month" />
            <FeeCard label="Insurance" value="$100–17k" sub="/year" />
            <FeeCard label="Donation" value="₹0" sub="No hidden fee" />
            <FeeCard label="Total / Year" value="Affordable" sub="Contact us" dark />
          </div>
        </div>
      </section>

      {/* ═══════════════ FMGE / LICENSING ═══════════════ */}
      <section className="bg-[#F9F8F6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-heading text-6xl font-bold leading-none text-[#0D1B3E] sm:text-7xl md:text-8xl">
                25–35<span className="text-[#F26419]">%</span>
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#4A4742]">
                Average FMGE first-attempt pass rates for students from many overseas medical universities. Students from structured programs consistently score higher.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
                Built to help you<br /><span className="font-normal italic">clear licensing exams</span>
              </h2>
              <p className="mt-3 leading-relaxed text-[#4A4742]">
                Students returning to India need to clear the FMGE/NExT exam. {university.name} integrates exam-oriented coaching into the regular curriculum so students are prepared from day one.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Regular mock tests and practice exams throughout the program',
                  'Faculty-guided FMGE preparation sessions every semester',
                  'Study material aligned with NMC/NExT syllabus',
                  'Clinical postings designed to strengthen practical knowledge',
                ].map((item, i) => (
                  <div key={`lic-${i}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F26419] text-[10px] text-white">✓</span>
                    <span className="text-sm text-[#4A4742]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 6-YEAR CURRICULUM ═══════════════ */}
      <section id="curriculum" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
            6-Year MD curriculum,<br /><span className="font-normal italic text-[#F26419]">year by year</span>
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-[#4A4742]">
            A structured program that takes you from foundational sciences to clinical mastery.
          </p>

          {/* Year tabs */}
          <div className="mt-10 flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto sm:pb-2">
            {CURRICULUM.map((c, i) => (
              <button
                key={`ct-${i}`}
                onClick={() => setCurrTab(i)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors sm:px-5 sm:py-2.5 sm:text-sm ${
                  currTab === i
                    ? 'bg-[#0D1B3E] text-white'
                    : 'border border-[#DDD9D2] bg-[#F9F8F6] text-[#4A4742] hover:border-[#0D1B3E]'
                }`}
              >
                {c.year}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#F26419] px-3 py-1 text-xs font-bold text-white">{CURRICULUM[currTab].year}</span>
              <h3 className="text-lg font-bold text-[#0D1B3E]">{CURRICULUM[currTab].title}</h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-[#4A4742]">{CURRICULUM[currTab].desc}</p>
            <p className="text-sm text-[#0D1B3E]"><span className="font-semibold">Key subjects:</span> {CURRICULUM[currTab].subjects}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ CAMPUS GALLERY — reusable protected component ═══════════════ */}
      {gallery.length > 0 && (
        <section id="campus" className="bg-[#F9F8F6] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <CollegeGallery images={gallery} universityName={university.name || 'Campus'} />
          </div>
        </section>
      )}

      {/* ═══════════════ WHAT LIFE LOOKS LIKE ON THE GROUND ═══════════════ */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F9F8F6]">
              {gallery.length > 0 ? (
                <SafeImage
                  src={gallery[Math.min(1, gallery.length - 1)]}
                  alt="Campus life"
                  fill
                  className="object-cover"
                  fallbackElement={
                    <div className="flex h-full w-full items-center justify-center bg-[#DDD9D2] text-sm text-[#4A4742]">Campus Image</div>
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#DDD9D2] text-sm text-[#4A4742]">Campus Image</div>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
                What life actually<br />looks like <span className="font-normal italic text-[#F26419]">on the ground</span>
              </h2>
              <div className="mt-6 space-y-5">
                {[
                  { icon: '🏠', title: 'Campus Accommodation', desc: 'Furnished hostel rooms with Wi-Fi, laundry, 24/7 security, and Indian mess on or near campus.' },
                  { icon: '🍛', title: 'Food & Dining', desc: 'Indian restaurants and mess facilities serving vegetarian and non-vegetarian home-style food daily.' },
                  { icon: '🤝', title: 'Indian Student Community', desc: 'Strong Indian community with cultural events, festival celebrations, and peer support groups.' },
                ].map((item, i) => (
                  <div key={`life-${i}`} className="flex gap-4">
                    <span className="mt-0.5 flex-shrink-0 text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0D1B3E]">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-[#4A4742]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOSPITAL ACCESS ═══════════════ */}
      <section className="bg-[#F9F8F6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
            Hospital access in<br /><span className="font-normal italic text-[#F26419]">{countryName ? `${countryName}\u2019s capital` : 'the capital city'}</span>
          </h2>
          <p className="mt-2 mb-10 max-w-xl text-[15px] text-[#4A4742]">
            Students get hands-on clinical training in government and private hospitals affiliated with the university.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { number: 'Yr 3', label: 'Clinical rotations start' },
              { number: '10+', label: 'Affiliated hospitals' },
              { number: countryName || 'Capital', label: 'City-based training' },
              { number: '1 Yr', label: 'Full internship' },
            ].map((s, i) => (
              <div key={`hosp-${i}`} className="rounded-xl border border-[#DDD9D2] bg-white p-3 text-center sm:p-6">
                <div className="font-heading text-xl font-bold text-[#0D1B3E] sm:text-3xl truncate">{s.number}</div>
                <div className="mt-1 text-xs text-[#4A4742]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FIRST-TIME STUDENT INFO ═══════════════ */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
            What a first-time student<br />actually needs to <span className="font-normal italic text-[#F26419]">know</span>
          </h2>
          <p className="mt-2 mb-10 max-w-xl text-[15px] text-[#4A4742]">
            Practical information for students planning to study at {university.name}.
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '❄️', title: 'Weather & Packing', desc: 'Prepare for all seasons. Thermal wear for winters, light clothing for summers. University provides heating in hostels.' },
              { icon: '✈️', title: 'Travel & Visa', desc: 'Student visa processed with university invitation letter. Direct and connecting flights from major Indian cities.' },
              { icon: '🏥', title: 'Health & Insurance', desc: 'Health insurance included in fees. Medical facility on campus plus city hospitals easily accessible.' },
              { icon: '📱', title: 'Communication', desc: 'Local SIM cards available. WhatsApp and video calls keep you connected with family back home.' },
              { icon: '💰', title: 'Monthly Budget', desc: 'Average monthly expenses of $150–$250 covering food, transport, and personal needs.' },
              { icon: '📚', title: 'Study Resources', desc: 'University library, online databases, and study groups. Seniors mentor juniors through academic challenges.' },
            ].map((item, i) => (
              <div key={`info-${i}`} className="rounded-xl border border-[#DDD9D2] bg-[#F9F8F6] p-5 transition-shadow hover:shadow-md">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-3 mb-1.5 text-sm font-semibold text-[#0D1B3E]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#4A4742]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ADMISSION PROCESS ═══════════════ */}
      {admissionProcess.length > 0 && (
        <section id="admission" className="bg-[#F9F8F6] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <h2 className="font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
              Admission in <span className="font-normal italic text-[#F26419]">{admissionProcess.length} steps</span>
            </h2>
            <p className="mt-2 mb-10 max-w-xl text-[15px] text-[#4A4742]">
              Our team guides you through every step — from application to arriving on campus.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {admissionProcess.map((step: any, i: number) => (
                <div key={`adm-${i}`} className="relative rounded-xl border border-[#DDD9D2] bg-white p-5">
                  <span className="absolute right-4 top-4 font-heading text-3xl font-bold text-[#F26419]/20">{String(step.step || i + 1).padStart(2, '0')}</span>
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F26419] text-xs font-bold text-white">
                    {step.step || i + 1}
                  </div>
                  <h3 className="mb-1 line-clamp-2 break-words pr-8 text-sm font-semibold text-[#0D1B3E]">{step.title || 'Step'}</h3>
                  {step.description && <p className="line-clamp-3 break-words text-xs leading-relaxed text-[#4A4742]">{step.description}</p>}
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-[#4A4742]">
              Admission Helpline — <Link href="/contact" className="font-semibold text-[#F26419] hover:underline">Contact our counsellors</Link> for step-by-step assistance.
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════ REVIEWS ═══════════════ */}
      <section id="reviews" className="bg-[#0D1B3E] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="mb-10 font-heading text-[1.75rem] font-bold leading-tight sm:text-[2rem] md:text-[2.25rem]">
            What our students<br />actually <span className="font-normal italic text-[#F26419]">say</span>
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STATIC_REVIEWS.map((review, i) => (
              <div key={`rev-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < review.rating ? 'text-yellow-400' : 'text-white/20'}>★</span>
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-white/80">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F26419] text-xs font-bold text-white">{review.initials}</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-white/50">{review.year} Student</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      {faqs.length > 0 && (
        <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[720px] px-5 sm:px-8">
            <h2 className="mb-10 font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
              Honest answers to<br /><span className="font-normal italic text-[#F26419]">the real questions</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq: any, i: number) => (
                <div key={`faq-${i}`} className="overflow-hidden rounded-xl border border-[#DDD9D2]">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#F9F8F6]">
                    <span className="line-clamp-2 break-words pr-4 text-sm font-semibold text-[#0D1B3E]">{faq.question || 'Question'}</span>
                    <span className={`flex-shrink-0 text-xl font-light text-[#F26419] transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="break-words text-sm leading-relaxed text-[#4A4742]">{faq.answer || 'Answer not available.'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ RELATED UNIVERSITIES ═══════════════ */}
      {relatedUniversities.length > 0 && (
        <section className="bg-[#F9F8F6] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <h2 className="mb-10 text-center font-heading text-[1.75rem] font-bold leading-tight text-[#0D1B3E] sm:text-[2rem] md:text-[2.25rem]">
              Other universities in {countryName}
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedUniversities.map((uni: any, i: number) => (
                <Link key={uni._id || `rel-${i}`} href={`/universities/${uni.slug}`} className="group overflow-hidden rounded-2xl border border-[#DDD9D2] bg-white transition-shadow hover:shadow-lg">
                  <div className="relative h-40 bg-[#0D1B3E]">
                    {pickUniversityImageSource(uni) ? (
                      <SafeImage src={pickUniversityImageSource(uni)} alt={uni.name || 'University'} fill className="object-cover transition-transform duration-300 group-hover:scale-105" fallbackElement={<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#162550] text-2xl text-white/30">🏫</div>} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D1B3E] to-[#162550] text-2xl text-white/30">🏫</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 break-words font-semibold text-[#0D1B3E] transition-colors group-hover:text-[#F26419]">{uni.name || 'University'}</h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#4A4742]">
                      {uni.annualFees && <span>💰 {uni.annualFees}</span>}
                      {uni.courseDuration && <span>⏱ {uni.courseDuration}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/universities" className="inline-flex items-center rounded-full border-2 border-[#0D1B3E] px-6 py-3 text-sm font-semibold text-[#0D1B3E] transition-colors hover:bg-[#0D1B3E] hover:text-white">
                View All Universities →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="bg-[#0D1B3E] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[800px] px-5 text-center sm:px-8">
          <h2 className="font-heading text-[1.75rem] font-bold leading-tight sm:text-[2.25rem] md:text-[2.75rem]">
            Let&apos;s get you into<br /><span className="font-normal italic text-[#F26419]">{university.name}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
            Our expert counsellors will guide you through the complete admission process — from documents to airport pickup.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#F26419] px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-[#FF8040] sm:text-lg">
              Start Your Application →
            </Link>
            <Link href="/universities" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-white/20 sm:text-lg">
              Compare Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
