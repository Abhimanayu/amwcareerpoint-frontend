const reviews = [
  {
    name: 'Dr. Messi Khan',
    time: 'London, England',
    rating: 5,
    text: 'Hi, I am Dr. Messi Khan from Madhya Pradesh. I got admission to a reputed medical university with the guidance and support of the team at AMW Career Point. The consultancy provided excellent assistance throughout the entire admission process, from documentation to university selection. Today, I am proudly working at Frimley Park Hospital, England. I highly recommend AMW Career Point to students planning to pursue MBBS abroad.',
  },
  {
    name: 'Jitendra Khatri',
    time: 'Rajasthan, India',
    rating: 5,
    text: 'Hello, I am Jitendra Khatri from Rajasthan. I would like to thank AMW Career Point for helping me secure admission in Ontario, Canada. The team guided me properly and provided complete transparency without any hidden costs or donations. Thanks to their support, I am receiving quality English-medium education abroad. I truly appreciate their honest guidance and professional services.',
  },
  {
    name: 'Tarun Jain',
    time: 'Kyrgyzstan',
    rating: 5,
    text: 'Hello, I am Tarun Jain, currently studying in the 5th year of MBBS in Kyrgyzstan. My experience with AMW Career Point has been excellent. The entire team was very supportive and guided me throughout the admission process. Their continuous assistance and professional approach made my MBBS journey smooth and stress-free. I am thankful to the team for their tremendous support.',
  },
  {
    name: 'Pratap Singh',
    time: 'Rajasthan, India',
    rating: 5,
    text: 'Hey, I am Pratap Singh from Rajasthan. I joined AMW Career Point for my MBBS admission in Kazakhstan, and I received highly professional guidance and support throughout the process. The team helped me at every step, from admission to documentation and travel assistance. Thank you so much to the entire team for guiding me so well and making my dream come true.',
  },
  {
    name: 'Pankaj Hathniya',
    time: 'Georgia',
    rating: 5,
    text: 'Hello, I am Pankaj Hathniya. I took admission in Georgia through AMW Career Point, and I am very thankful to Dr. Haripal Sir for his guidance and continuous support. The consultancy team helped me in every aspect of my studies and settlement abroad. AMW Career Point is truly one of the best consultancies for MBBS abroad, and today I am proud to be pursuing my medical career successfully.',
  },
  {
    name: 'Nikita Rohila',
    time: 'Russia',
    rating: 5,
    text: 'Hi, I am Nikita Rohila. AMW Career Point is a trustworthy consultancy for students planning to study abroad. The management and staff members were extremely supportive during my admission process in Russia. They helped me with hostel arrangements, college admission, and overall settlement abroad. Their guidance and support made my transition smooth and comfortable. I highly recommend AMW Career Point for higher studies abroad.',
  },
  {
    name: 'Shreya Tyagi',
    time: 'Delhi, India',
    rating: 5,
    text: 'Hello, I am Shreya Tyagi from Delhi and currently a 3rd-year MBBS student in Russia. I got admission through AMW Career Point, and my experience with the consultancy has been wonderful. The staff members are very humble, supportive, and always ready to help students whenever needed. I am grateful to the entire team for helping me achieve my dream of studying MBBS abroad.',
  },
];

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=AMW+Career+Point+Jaipur+reviews';

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

export function ReviewsSection() {
  return (
    <section className="bg-[#F9F8F6] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Verified Reviews</span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">What Parents &amp; Students Say</h2>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-xl border border-[#DDD9D2] bg-white px-4 sm:px-5 py-2.5 sm:py-3">
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#F26419]">5.0</span>
            <span className="text-[12px] sm:text-[13px] font-semibold text-[#0D1B3E]">5/5 Rating</span>
            <span className="text-[12px] sm:text-[13px] text-[#4A4742]">Trusted by AMW students worldwide</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {reviews.slice(0, 6).map((review) => (
            <div key={review.name} className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0D1B3E] flex items-center justify-center text-white text-[11px] font-bold">
                  {getInitials(review.name)}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#0D1B3E]">{review.name}</div>
                  <div className="text-[10px] text-[#4A4742]">{review.time}</div>
                </div>
              </div>
              <div className="text-[#F26419] text-[13px] font-semibold mb-1.5">{review.rating}/5 Verified Review</div>
              <p className="text-[13px] text-[#4A4742] leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0D1B3E] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#142a5a]"
            aria-label="View all reviews on Google"
          >
            View All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
