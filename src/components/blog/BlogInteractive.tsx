'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitEnquiry } from '@/lib/enquiries';

/* ─── Hero Search Bar ─── */
export function BlogSearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const searchParams = useSearchParams();
  const currentQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery || currentQ);
  const router = useRouter();

  // Sync state when URL changes (e.g. after clear + refresh)
  useEffect(() => {
    setQuery(currentQ);
  }, [currentQ]);

  const handleSearch = () => {
    const q = query.trim();
    if (q) {
      router.push(`/blogs?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/blogs');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/blogs');
  };

  return (
    <div className="flex max-w-md mb-6 sm:mb-8">
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          placeholder="Search: FMGE pass rate, Georgia fees, NMC rules..."
          className="w-full h-10 sm:h-11 rounded-l-lg bg-white/10 border border-white/20 px-3 sm:px-4 pr-8 text-[12px] sm:text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleSearch}
        className="inline-flex items-center h-10 sm:h-11 px-4 sm:px-5 rounded-r-lg bg-[#F26419] text-white text-[12px] sm:text-[13px] font-bold hover:bg-[#FF8040] transition-colors shrink-0"
      >
        Search
      </button>
    </div>
  );
}

/* ─── NEET Score Check ─── */
export function NeetScoreCheck() {
  const [score, setScore] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleCheck = () => {
    const num = parseInt(score, 10);
    if (isNaN(num) || num < 0 || num > 720) {
      setResult('Please enter a valid NEET score (0–720)');
      return;
    }
    if (num >= 500) {
      setResult('🟢 Excellent! You qualify for top universities in Russia, Georgia, Kazakhstan & more.');
    } else if (num >= 400) {
      setResult('🟡 Good score! You have options in Kazakhstan, Kyrgyzstan, Philippines & others.');
    } else if (num >= 250) {
      setResult('🟠 You can explore universities in Kyrgyzstan, Uzbekistan & select options.');
    } else {
      setResult('🔴 Limited options available. Contact our counsellors for personalized guidance.');
    }
  };

  return (
    <div className="rounded-xl border border-[#DDD9D2] bg-[#F9F8F6] p-4 sm:p-5">
      <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4A4742] mb-2 sm:mb-3">
        NEET Score Check
      </h4>
      <p className="text-[11px] sm:text-[12px] text-[#4A4742] mb-2 sm:mb-3">
        Enter your NEET score to see your options
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          max={720}
          value={score}
          onChange={(e) => { setScore(e.target.value); setResult(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleCheck(); }}
          placeholder="e.g. 520"
          className="flex-1 min-w-0 h-9 rounded-lg border border-[#DDD9D2] bg-white px-3 text-[11px] sm:text-[12px] text-[#0D1B3E] placeholder:text-[#4A4742]/50 focus:outline-none focus:ring-1 focus:ring-[#F26419]"
        />
        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex items-center h-9 px-3 sm:px-4 rounded-lg bg-[#0D1B3E] text-white text-[10px] sm:text-[11px] font-bold hover:bg-[#162550] transition-colors shrink-0"
        >
          Check
        </button>
      </div>
      {result && (
        <p className="mt-2 text-[11px] sm:text-[12px] text-[#0D1B3E] leading-relaxed">{result}</p>
      )}
    </div>
  );
}

/* ─── Subscribe Form (reusable for sidebar + bottom CTA) ─── */
export function SubscribeForm({ variant = 'sidebar' }: { variant?: 'sidebar' | 'hero' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    setStatus('sending');
    try {
      await submitEnquiry({ name: 'Blog Subscriber', email: trimmed, phone: 'N/A', message: 'Newsletter subscription from blog page', source: 'blog-subscribe' });
      setStatus('success');
      setMessage('Subscribed! Check your inbox.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'hero') {
    return (
      <div className="w-full lg:w-auto">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status !== 'idle') { setStatus('idle'); setMessage(''); } }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder="Your email address"
            className="h-10 sm:h-11 flex-1 sm:w-56 lg:w-64 min-w-0 rounded-lg sm:rounded-r-none border border-white/20 bg-white/10 px-3 sm:px-4 text-[12px] sm:text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
          />
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={status === 'sending'}
            className="h-10 sm:h-11 inline-flex items-center justify-center px-5 sm:px-6 rounded-lg sm:rounded-l-none bg-[#F26419] text-white text-[12px] sm:text-[13px] font-bold whitespace-nowrap hover:bg-[#FF8040] transition-colors disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Subscribe Free'}
          </button>
        </div>
        {message ? (
          <p className={`text-[10px] sm:text-[11px] mt-1.5 sm:mt-2 sm:text-right ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}>{message}</p>
        ) : (
          <p className="text-[9px] sm:text-[10px] text-blue-100/50 mt-1.5 sm:mt-2 sm:text-right">
            No spam. Unsubscribe any time.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5">
      <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4A4742] mb-2">
        Weekly Digest
      </h4>
      <p className="text-[11px] sm:text-[12px] text-[#4A4742] leading-relaxed mb-2 sm:mb-3">
        NMC updates, university news, and the best MBBS guides — every Tuesday.
        3,200+ subscribers. No spam.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status !== 'idle') { setStatus('idle'); setMessage(''); } }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        placeholder="Your email address"
        className="w-full h-9 rounded-lg border border-[#DDD9D2] bg-[#F9F8F6] px-3 text-[11px] sm:text-[12px] text-[#0D1B3E] placeholder:text-[#4A4742]/50 mb-2 focus:outline-none focus:ring-1 focus:ring-[#F26419]"
      />
      <button
        type="button"
        onClick={() => handleSubmit()}
        disabled={status === 'sending'}
        className="w-full h-9 rounded-lg bg-[#0D1B3E] text-white text-[11px] sm:text-[12px] font-bold hover:bg-[#162550] transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending...' : 'Subscribe Free'}
      </button>
      {message ? (
        <p className={`text-[9px] sm:text-[10px] text-center mt-1.5 ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>
      ) : (
        <p className="text-[9px] sm:text-[10px] text-[#4A4742]/60 text-center mt-1.5">
          Unsubscribe any time. No spam ever.
        </p>
      )}
    </div>
  );
}
