import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCountryBySlug } from '@/lib/countries';
import { CounsellingForm } from '@/components/home/CounsellingForm';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCountryBySlug(slug).catch(() => null);
  const country = res?.data || res;
  if (!country) return { title: 'Country not found' };
  return {
    title: `${country.name} | MBBS Abroad`,
    description:
      country.metaDescription || country.tagline || country.description || '',
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const res = await getCountryBySlug(slug).catch(() => null);
  const country = res?.data || res;
  if (!country) return notFound();

  const highlights = Array.isArray(country.highlights) ? country.highlights : [];
  const features = Array.isArray(country.features) ? country.features : [];
  const eligibility = Array.isArray(country.eligibility) ? country.eligibility : [];
  const process = Array.isArray(country.admissionProcess) ? country.admissionProcess : [];
  const stats = [
    { label: 'Tuition Fees / year', value: country.feeRange ?? '—' },
    { label: 'Duration', value: country.duration ?? '—' },
    { label: 'Currency', value: country.currency ?? '—' },
    { label: 'Living cost (approx.)', value: country.livingCost ?? '—' },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative">
        {country.heroImage && (
          <Image
            src={country.heroImage}
            alt={country.name}
            width={1600}
            height={640}
            className="h-[260px] w-full object-cover sm:h-[360px]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                MBBS in {country.name}
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">{country.name}</h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base line-clamp-3">
                {country.tagline ||
                  country.description ||
                  'Top destination for quality medical education abroad.'}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-xl bg-white/90 p-4 text-[#0D1B3E] shadow-lg backdrop-blur">
                <div className="text-sm font-semibold">Eligibility</div>
                <div className="text-lg font-bold text-[#F26419] mt-1">
                  {country.eligibility?.[0] || 'NEET qualified'}
                </div>
                <div className="mt-3 text-sm">
                  Get your personalised guidance now.
                </div>
                <Link
                  href="#counselling"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[#F26419] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF8040]"
                >
                  Get Admission Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts + form */}
      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-[#DDD9D2] p-5 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-[#0D1B3E]">
              Why choose {country.name}?
            </h2>
            <p className="mt-2 text-sm text-[#4A4742] line-clamp-4">
              {country.description ||
                'Affordable tuition, English-medium programs, and globally recognized degrees.'}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg bg-[#F9F8F6] px-4 py-3 text-sm text-[#0D1B3E]"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="font-semibold text-[#F26419]">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-20">
            <CounsellingForm />
          </div>
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="bg-[#0D1B3E] px-4 py-10 text-white">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-xl font-heading font-bold">Key Highlights</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h: string, i: number) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm line-clamp-2"
                >
                  • {h}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fees + CTA */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h3 className="text-xl font-heading font-bold text-[#0D1B3E]">
                Affordable fee structure
              </h3>
              <p className="mt-2 text-sm text-[#4A4742]">
                Transparent annual tuition with low living costs. Ask us for
                exact fee sheets and latest scholarship options.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-center justify-between text-sm text-[#0D1B3E]">
                <span>Tuition (per year)</span>
                <span className="font-semibold text-[#F26419]">
                  {country.feeRange ?? 'On request'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-[#0D1B3E]">
                <span>Living cost (approx.)</span>
                <span className="font-semibold">
                  {country.livingCost ?? 'On request'}
                </span>
              </div>
              <Link
                href="#counselling"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#F26419] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF8040]"
              >
                Get Latest Fee Sheet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {features.length > 0 && (
        <section className="px-4 pb-10">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-xl font-heading font-bold text-[#0D1B3E]">
              What you&apos;ll love about {country.name}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.slice(0, 6).map((f: any, i: number) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#DDD9D2] p-4 shadow-sm"
                >
                  <div className="text-[#F26419] text-lg">{f.icon || '•'}</div>
                  <div className="mt-2 font-semibold text-[#0D1B3E] line-clamp-1">
                    {f.title || 'Feature'}
                  </div>
                  {f.description && (
                    <div className="text-sm text-[#4A4742] line-clamp-2">
                      {f.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Eligibility */}
      {eligibility.length > 0 && (
        <section className="bg-[#F9F8F6] px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-xl font-heading font-bold text-[#0D1B3E]">
              Eligibility
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {eligibility.map((item: string, i: number) => (
                <div
                  key={i}
                  className="rounded-lg bg-white px-4 py-3 text-sm text-[#0D1B3E] shadow-sm"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Admission process */}
      {process.length > 0 && (
        <section className="px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-xl font-heading font-bold text-[#0D1B3E]">
              Admission process
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {process.map((step: any) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-[#DDD9D2] p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#F26419]">
                    Step {step.step}
                  </div>
                  <div className="mt-1 text-base font-bold text-[#0D1B3E] line-clamp-1">
                    {step.title || 'Step'}
                  </div>
                  <div className="text-sm text-[#4A4742] line-clamp-2">
                    {step.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-[#0D1B3E] px-4 py-10 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-3">
          <h3 className="text-2xl font-heading font-bold">
            Let&apos;s get you into the right university
          </h3>
          <p className="text-sm text-white/70">
            Talk to our counsellors for seat availability, fee sheets, and visa
            support.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="#counselling"
              className="inline-flex items-center justify-center rounded-full bg-[#F26419] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF8040]"
            >
              Book Free Call
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center justify-center rounded-full border border-white px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#0D1B3E]"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}