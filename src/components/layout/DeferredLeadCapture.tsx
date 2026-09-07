'use client';

import { useEffect, useState } from 'react';
import { submitEnquiry } from '@/lib/enquiries';

const DISMISSED_KEY = 'amw-lead-popup-dismissed';

export function DeferredLeadCapture() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: 'MBBS Abroad' });

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 9000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && dismiss();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISSED_KEY, 'true');
    setOpen(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitEnquiry({ ...form, message: `Course: ${form.course}`, source: 'automatic-lead-popup' });
      setSubmitted(true);
      window.sessionStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      setError('Could not submit right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const inputClass = 'h-11 w-full rounded-md border border-[#CFC9BE] bg-white px-3 text-sm text-[#0D1B3E] outline-none focus:border-[#F26419] focus:ring-2 focus:ring-orange-100';
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#0D1B3E]/55 p-3 sm:items-center" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && dismiss()}>
      <section role="dialog" aria-modal="true" aria-labelledby="lead-popup-title" className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-2xl sm:p-7">
        <button type="button" onClick={dismiss} aria-label="Close counselling form" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#4A4742] hover:bg-[#F9F8F6]">×</button>
        {submitted ? (
          <div className="py-8 text-center">
            <h2 id="lead-popup-title" className="font-heading text-2xl font-bold text-[#0D1B3E]">Thank you</h2>
            <p className="mt-2 text-sm text-[#4A4742]">Our counsellor will contact you shortly.</p>
            <button type="button" onClick={dismiss} className="mt-5 rounded-full bg-[#F26419] px-6 py-2.5 text-sm font-semibold text-white">Done</button>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase text-[#F26419]">Free counselling</p>
            <h2 id="lead-popup-title" className="mt-1 pr-8 font-heading text-2xl font-bold text-[#0D1B3E]">Plan your MBBS admission</h2>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <div><label htmlFor="lead-name" className="mb-1 block text-sm font-medium">Name</label><input id="lead-name" required minLength={2} className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label htmlFor="lead-email" className="mb-1 block text-sm font-medium">Email</label><input id="lead-email" required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><label htmlFor="lead-phone" className="mb-1 block text-sm font-medium">Mobile</label><input id="lead-phone" required type="tel" pattern="[0-9+() -]{7,15}" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><label htmlFor="lead-course" className="mb-1 block text-sm font-medium">Course</label><select id="lead-course" className={inputClass} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}><option>MBBS Abroad</option><option>MBBS in India</option><option>NEET Counselling</option><option>Other</option></select></div>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <button disabled={submitting} className="w-full rounded-full bg-[#F26419] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Request a callback'}</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
