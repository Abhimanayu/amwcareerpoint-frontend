'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';
import { IndiaPage, IndiaCollege } from '@/lib/india';
const control = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#0D1B3E] focus:outline-none focus:ring-2 focus:ring-[#F26419]';
export function IndiaDirectory({ states = [], colleges, storageKey = 'india-states' }: { states?: IndiaPage[]; colleges?: IndiaCollege[]; storageKey?: string }) {
  const [filters, setFilters] = useState({ search: '', city: '', type: '', budget: '' });
  useEffect(() => { const frame = requestAnimationFrame(() => { try { const saved = sessionStorage.getItem(storageKey); if (saved) { const parsed = JSON.parse(saved); if (parsed && ['search','city','type','budget'].every(k => typeof parsed[k] === 'string')) setFilters(parsed); } } catch { /* Storage may be disabled. */ } }); return () => cancelAnimationFrame(frame); }, [storageKey]);
  const change = (key: keyof typeof filters, value: string) => { const next = { ...filters, [key]: value }; setFilters(next); try { sessionStorage.setItem(storageKey, JSON.stringify(next)); } catch {} };
  const needle = filters.search.trim().toLowerCase();
  const visibleStates = states.filter(s => s.name.toLowerCase().includes(needle));
  const visibleColleges = colleges?.filter(c => `${c.name} ${c.city}`.toLowerCase().includes(needle) && (!filters.city || c.city === filters.city) && (!filters.type || c.india?.management === filters.type) && (!filters.budget || (c.india?.annualTuition != null && c.india.annualTuition <= Number(filters.budget))));
  return <section id="explore" className="scroll-mt-24 py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F26419]">Explore your options</p><h2 className="mt-3 font-heading text-3xl font-bold text-[#0D1B3E]">{colleges ? 'Find your medical college' : 'Your MBBS journey starts with a state'}</h2>
    <div className={`my-7 grid gap-3 ${colleges ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:max-w-md'}`}>
      <input aria-label={colleges ? 'Search colleges' : 'Search states'} placeholder={colleges ? 'Search college or city' : 'Search a state'} value={filters.search} onChange={e => change('search', e.target.value)} className={control} />
      {colleges && <><select aria-label="Filter by city" value={filters.city} onChange={e => change('city', e.target.value)} className={control}><option value="">All cities</option>{[...new Set(colleges.map(c => c.city).filter(Boolean))].sort().map(c => <option key={c}>{c}</option>)}</select><select aria-label="Filter by management" value={filters.type} onChange={e => change('type', e.target.value)} className={control}><option value="">All management types</option><option>Government</option><option>Private</option></select><select aria-label="Annual tuition budget" value={filters.budget} onChange={e => change('budget', e.target.value)} className={control}><option value="">Any annual tuition</option><option value="100000">Up to ₹1 lakh / year</option><option value="500000">Up to ₹5 lakh / year</option><option value="1500000">Up to ₹15 lakh / year</option></select></>}
    </div>
    <p aria-live="polite" className="mb-4 text-sm text-gray-500">{colleges ? `${visibleColleges?.length} listed colleges` : `${visibleStates.length} state guides`}</p>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {!colleges && visibleStates.map((s, i) => <Link key={s.slug} href={`/mbbs-india/${s.slug}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-[#F26419] hover:shadow-lg">
        {s.image ? <SafeImage src={s.image} alt={s.imageAlt || s.name} width={600} height={300} className="h-40 w-full object-cover" /> : <div className="flex h-32 items-center justify-between bg-gradient-to-br from-[#0D1B3E] to-[#243d65] px-7 text-white"><span className="font-heading text-4xl">{s.name.slice(0,2).toUpperCase()}</span><span className="text-sm text-white/60">{String(i+1).padStart(2,'0')} / INDIA</span></div>}
        <div className="p-6"><h3 className="font-heading text-xl font-bold text-[#0D1B3E]">MBBS in {s.name}</h3><p className="mt-3 line-clamp-3 text-sm text-gray-500">{s.intro}</p><span className="mt-5 inline-block text-sm font-bold text-[#F26419]">Explore state guide →</span></div></Link>)}
      {visibleColleges?.map(c => <article key={c._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {c.heroImage && <SafeImage src={c.heroImage} alt={c.heroImageAlt || c.name} width={600} height={300} className="h-44 w-full object-cover" />}
        <div className="p-6"><p className="text-xs font-semibold uppercase tracking-wider text-[#F26419]">{[c.city, c.india?.management, c.india?.deemed ? 'Deemed university' : ''].filter(Boolean).join(' · ')}</p><h3 className="mt-3 font-heading text-xl font-bold text-[#0D1B3E]"><Link href={`/college/${c.slug}`}>{c.name}</Link></h3><dl className="my-5 space-y-2 text-sm"><div className="flex justify-between gap-3"><dt>Annual tuition</dt><dd className="font-semibold">{c.india?.annualTuition != null ? `₹${c.india.annualTuition.toLocaleString('en-IN')}` : 'Awaiting verified update'}</dd></div>{c.india?.seats != null && <div className="flex justify-between"><dt>MBBS seats</dt><dd>{c.india.seats}</dd></div>}{c.india?.academicYear && <div className="flex justify-between"><dt>Academic year</dt><dd>{c.india.academicYear}</dd></div>}</dl><Link className="inline-flex rounded-full bg-[#0D1B3E] px-5 py-2.5 text-sm font-semibold text-white" href={`/college/${c.slug}`}>View college →</Link></div>
      </article>)}
    </div>
    {(colleges ? !visibleColleges?.length : !visibleStates.length) && <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center"><p>{needle || filters.city || filters.type || filters.budget ? 'No matches. Try changing your filters.' : colleges ? 'College information will appear here as it is published.' : 'State guides are being prepared. Our team can help you explore your options.'}</p><a href="#counselling" className="mt-4 inline-block font-semibold text-[#F26419]">Speak to a counsellor →</a></div>}
  </div></section>;
}
