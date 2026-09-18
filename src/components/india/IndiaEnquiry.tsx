'use client';
import { useEffect, useState } from 'react';
import { submitEnquiry } from '@/lib/enquiries';
import { handleApiError } from '@/lib/handleApiError';
import type { IndiaPage } from '@/lib/india';
export function IndiaEnquiry({ state = '', college = '', states = [], label = 'Get free counselling', preview = false }: { state?: string; college?: string; states?: IndiaPage[]; label?: string; preview?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(frame); }, []);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [fields, setFields] = useState({ name: '', phone: '', email: '', interestedState: '', neetRank: '', academicYear: '' });
  const [consent, setConsent] = useState(false);
  const fieldProps = (name: keyof typeof fields) => ({ name, value: fields[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const value = event.target.value; setFields(p => ({ ...p, [name]: value })); } });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (preview || busy) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true); setMessage('');
    try { await submitEnquiry({ ...values, interestedCountry: 'India', interestedCollege: college, source: window.location.pathname }); setSuccess(true); setMessage('Thank you! Our counselling team will contact you.'); }
    catch (error) { setMessage(handleApiError(error)); } finally { setBusy(false); }
  }
  const input = 'mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26419]';
  return <form id="counselling" onSubmit={submit} className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-6 text-[#0D1B3E] shadow-lg sm:p-7">
    <h2 className="font-heading text-2xl font-bold">Let’s plan your MBBS journey</h2><p className="mt-2 mb-5 text-sm text-gray-500">{college || (state ? `Get guidance for colleges in ${state}.` : 'Explore your options with our counselling team.')}</p>
    {!success && <fieldset disabled={!ready || busy || preview} className="space-y-3 disabled:opacity-60">
      <label className="block text-sm font-medium">Full name<input {...fieldProps('name')} autoComplete="name" required maxLength={100} className={input} /></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-medium">Phone<input {...fieldProps('phone')} type="tel" autoComplete="tel" required pattern="[+]?[0-9 ]{10,17}" maxLength={18} className={input} /></label><label className="block text-sm font-medium">Email<input {...fieldProps('email')} type="email" autoComplete="email" required maxLength={150} className={input} /></label></div>
      <label className="block text-sm font-medium">Interested state{state ? <input name="interestedState" value={state} readOnly className={input} /> : <select {...fieldProps('interestedState')} className={input}><option value="">Help me choose</option>{states.map(s => <option key={s.slug}>{s.name}</option>)}</select>}</label>
      <div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">NEET rank (optional)<input {...fieldProps('neetRank')} type="number" min="1" max="10000000" className={input} /></label><label className="text-sm font-medium">Admission year (optional)<input {...fieldProps('academicYear')} type="number" min="2020" max="2100" className={input} /></label></div>
      <label className="flex items-start gap-2 text-xs text-gray-500"><input required type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />I agree to be contacted by AMW Career Point about my enquiry.</label>
      <button disabled={busy || preview} className="w-full rounded-full bg-[#F26419] px-4 py-3 text-sm font-bold text-white hover:bg-[#e75a12] disabled:opacity-60">{busy ? 'Submitting…' : label}</button>
    </fieldset>}
    {message && <p role={success ? 'status' : 'alert'} className={`mt-4 text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>{message}</p>}
  </form>;
}
