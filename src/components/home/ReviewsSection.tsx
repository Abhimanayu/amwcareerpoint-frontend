'use client';

import Image from 'next/image';
import { Carousel } from '@/components/ui/Carousel';

type Review = {
  name: string;
  role: 'Student' | 'Parent';
  location: string;
  image: string;
  text: string;
};

const reviews: Review[] = [
  {
    name: 'Govind Agarwal',
    role: 'Student',
    location: 'MBBS Abroad Student',
    image: '/reviews/govind-agarwal.png',
    text: 'I would say best consultant in India The AMW CAREER POINT. The proper guidance that they have given to me for my future I am very much thankful to whole team of AMW CAREER POINT. Where I am right now he is 24/7 available for any query such as Hostel, mess, classes and so all... I would say if you are looking forward to study in abroad for MBBS you must visit AMW CAREER POINT.',
  },
  {
    name: 'Lalit Kumar Jatav',
    role: 'Parent',
    location: 'Parent of MBBS Abroad Student',
    image: '/reviews/lalit-kumar-jatav.png',
    text: "I chose AMW Career Point for my son Prashant Jhajiya's admission abroad, and I'm truly thankful for that decision. The guidance, support, and professionalism shown by Dr. Hari Pal Sir and his team were exceptional. They made the complex admission and visa process smooth and stress-free. I highly recommend AMW to every parent who wants a trustworthy and experienced team for their child's future abroad.",
  },
  {
    name: 'Aastha Khare',
    role: 'Student',
    location: 'MBBS Abroad Student',
    image: '/reviews/aastha-khare.jpeg',
    text: 'I was a really great experience connecting with AMW Career Point. They are really helpful and understand needs of students also help with the procedures with every student should undergo during foreign medical. They look after every small or big need of their students.',
  },
  {
    name: 'Dimpal Saini',
    role: 'Parent',
    location: 'Family Review',
    image: '/reviews/dimpal-saini.png',
    text: 'Thanks to Dr. Haripal Sir and his dedicated team, my younger brother, Vivek Saini, secured admission to his desired medical college. They supported us throughout the entire admission process and guided us at every step with care and professionalism. We are truly grateful for your valuable assistance. Thank you, AMW Career Point!',
  },
  {
    name: 'Shiran',
    role: 'Student',
    location: 'MBBS Abroad Student',
    image: '/reviews/shiran.png',
    text: 'Very good work done by Dr. Haripal sir. They really take care of every student who go outside India for higher studies. In my opinion it is the best consultancy I have ever seen.',
  },
  {
    name: 'Deepak Kumar Sharma',
    role: 'Student',
    location: 'MBBS Abroad Student',
    image: '/reviews/deepak-kumar-sharma.png',
    text: 'Best consultant for MBBS abroad in India, because many of my friends gone abroad via this consultancy and thanks to Dr Haripal sir for best guidance and he is always very helpful.',
  },
  {
    name: 'Dr. Bijendra Singh',
    role: 'Parent',
    location: 'Parent Review',
    image: '/reviews/dr-bijendra-singh.png',
    text: 'It is a very good reputed medical consultancy. The standards of education at the best level. There is no cheating with the students. The excellent guidance by team and good preparation for FMG exams. The children have a very good environment to live and eat. The food and the cooks are also Indian. The great team and enthusiastic people to always support our kids.',
  },
  {
    name: 'Ayush Jindal',
    role: 'Student',
    location: 'MBBS Abroad Student',
    image: '/reviews/Ayush_Jindal_2048x2048.png',
    text: 'Excellent consultancy throughout my journey of MBBS the consultancy gave me full guidance study material and all the possible help highly thankful to Dr. Haripal Sir.',
  },
  {
    name: 'Harsh Vardhan',
    role: 'Student',
    location: 'MBBS Abroad Student',
    image: '/reviews/Harsh_Vardhan_2048x2048.png',
    text: 'I ever dreamed of studying MBBS abroad, and one day I found AMW CAREER POINT. They have expert counselors that assist in making your path very smooth to chase your dream. I am thankful to AMW.',
  },
];

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=AMW+Career+Point+Jaipur+reviews';

export function ReviewsSection() {
  return (
    <section className="bg-[#F9F8F6] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#0D1B3E] shadow-[0_24px_70px_rgba(13,27,62,0.18)]">
          <div className="grid gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-10">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFB38A]">
                Verified Google Reviews
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                What Parents &amp; Students Say
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 sm:text-base">
                Real admission journeys from students and families guided by AMW Career Point.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white px-5 py-4 shadow-xl sm:min-w-72">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-heading text-4xl font-bold leading-none text-[#F26419]">5.0</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#6B665F]">Google Rating</div>
                </div>
                <div className="h-12 w-px bg-[#E7DED5]" />
                <div>
                  <div className="text-lg leading-none text-[#F5B400]" aria-label="5 star rating">
                    ★★★★★
                  </div>
                  <div className="mt-2 text-xs font-semibold text-[#0D1B3E]">Students + Parents</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFDF9] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
            <Carousel slideClass="basis-full px-2 sm:basis-1/2 sm:pl-4 sm:pr-0 lg:basis-1/3">
              {reviews.map((review) => (
                <article
                  key={review.name}
                  className="group relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-xl border border-[#E4D8CD] bg-white shadow-[0_14px_35px_rgba(13,27,62,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(13,27,62,0.14)]"
                >
                  <div className="h-1.5 bg-[#F26419]" />
                  <div className="flex items-start gap-4 p-5 pb-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-[#F9F8F6] shadow-md ring-1 ring-[#E9DED3]">
                      <Image
                        src={review.image}
                        alt={`${review.name} review photo`}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold leading-snug text-[#0D1B3E]">{review.name}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            review.role === 'Student'
                              ? 'bg-[#DDF5EE] text-[#08735C]'
                              : 'bg-[#FFE7D8] text-[#B9410B]'
                          }`}
                        >
                          {review.role}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#6B665F]">{review.location}</p>
                    </div>
                  </div>

                  <div className="mx-5 flex items-center justify-between gap-3 border-y border-[#EFE5DC] py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] leading-none text-[#F5B400]" aria-label="5 star rating">
                        ★★★★★
                      </span>
                      <span className="text-xs font-bold text-[#F26419]">5/5</span>
                    </div>
                    <span className="rounded-full bg-[#F4F7FB] px-2.5 py-1 text-[11px] font-semibold text-[#536070]">
                      Google Review
                    </span>
                  </div>

                  <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
                    <span className="absolute right-5 top-1 font-heading text-6xl leading-none text-[#F26419]/10">
                      &quot;
                    </span>
                    <p className="relative flex-1 text-sm leading-7 text-[#31343A]">{review.text}</p>
                  </div>
                </article>
              ))}
            </Carousel>

            <div className="mt-8 text-center">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F26419] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(242,100,25,0.25)] transition-colors hover:bg-[#d94f0d]"
                aria-label="View all reviews on Google"
              >
                View All Reviews on Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
