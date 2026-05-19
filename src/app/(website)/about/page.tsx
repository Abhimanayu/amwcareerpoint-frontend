import { Metadata } from 'next';
import { FAQSection } from '@/components/home/FAQSection';
import { getAboutSettings } from '@/lib/about';
import { defaultAboutSettings, mergeAboutSettings } from '@/lib/aboutSettings';
import { SEO_HOLD } from '@/lib/seoHold';
import { getPublicFaqs } from '@/lib/server/faqs';

async function readAboutSettings() {
  try {
    return mergeAboutSettings(await getAboutSettings());
  } catch {
    return defaultAboutSettings;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  if (SEO_HOLD) {
    return {
      title: 'AMW Career Point',
      description: 'AMW Career Point official website.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const settings = await readAboutSettings();
  return {
    title: {
      absolute: settings.seo.metaTitle || defaultAboutSettings.seo.metaTitle,
    },
    description: settings.seo.metaDescription || defaultAboutSettings.seo.metaDescription,
    keywords: settings.seo.keywords || undefined,
    alternates: { canonical: settings.seo.canonicalUrl || '/about' },
  };
}

export default async function AboutPage() {
  const settings = await readAboutSettings();
  const faqs = SEO_HOLD ? [] : await getPublicFaqs('about', {
    fallback: [
      {
        question: 'What does AMW Career Point do?',
        answer: 'We guide students through MBBS abroad admissions, university selection, documentation, and visa support.',
      },
      {
        question: 'How long has AMW Career Point been helping students?',
        answer: 'We have been guiding medical aspirants for more than 15 years with a student-first approach.',
      },
      {
        question: 'Is the About Us FAQ section managed from admin?',
        answer: 'Yes. Create FAQs under the About Us page in the admin FAQ screen and they will appear here.',
      },
    ],
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      {settings.sections.hero && (
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            {settings.hero.eyebrow}
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold text-white leading-tight mb-4">
            {settings.hero.title}
          </h1>
          <p className="text-[15px] text-white/70 max-w-3xl mx-auto">
            {settings.hero.subtitle}
          </p>
        </div>
      </section>
      )}

      {/* ── Our Story ── */}
      {settings.sections.story && (
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
                {settings.story.eyebrow}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-5">
                {settings.story.title}
              </h2>
              <div className="space-y-4 text-[15px] text-[#4A4742] leading-relaxed">
                {settings.story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            {settings.sections.achievements && (
            <div className="rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] p-6 sm:p-8">
              <h3 className="font-heading text-xl font-bold text-[#0D1B3E] mb-6">{settings.achievements.title}</h3>
              <div className="grid grid-cols-2 gap-6">
                {settings.achievements.items.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-[#F26419] mb-1">{stat.value}</div>
                    <div className="text-[13px] text-[#4A4742]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ── Values ── */}
      {settings.sections.values && (
      <section className="py-10 sm:py-14 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
              {settings.values.eyebrow}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-2">
              {settings.values.title}
            </h2>
            <p className="text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              {settings.values.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.values.items.map((v) => (
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
      )}

      {/* ── Team ── */}
      {settings.sections.team && (
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
              {settings.team.eyebrow}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-2">
              {settings.team.title}
            </h2>
            <p className="text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              {settings.team.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.team.members.map((member) => (
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
      )}

      {/* ── FAQ ── */}
      {faqs.length > 0 && <FAQSection faqs={faqs} />}

      {/* ── Mission CTA ── */}
      {settings.sections.mission && (
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            {settings.mission.eyebrow}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {settings.mission.title}
          </h2>
          <p className="text-[15px] text-white/70 max-w-3xl mx-auto mb-10">
            {settings.mission.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.mission.items.map((item) => (
              <div key={item.title} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-heading text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[13px] text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </div>
  );
}