'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';

const ALL_STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

interface StateMeta {
  [state: string]: {
    categories: string[];
    quotas: string[];
    subCategoriesByCategory?: Record<string, string[]>;
  };
}

interface PredictorResult {
  state: string;
  college: string;
  rawCategory: string;
  category: string;
  subCategory: string | null;
  closingRank: number;
  quota: string;
}

interface ApiResponse {
  rank: number;
  state: string;
  category: string;
  subCategory?: string | null;
  quota: string;
  totalMatches: number;
  results: PredictorResult[];
}

const ITEMS_PER_PAGE = 25;

function normalizeQuotaKey(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

function normalizeQuotaLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function CollegePredictorClient() {
  const [rank, setRank] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [quota, setQuota] = useState('');
  const [stateMeta, setStateMeta] = useState<StateMeta>({});
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/college-predictor?meta=1')
      .then(r => r.json())
      .then(d => { setStateMeta(d.stateMeta || {}); setMetaLoading(false); })
      .catch(() => setMetaLoading(false));
  }, []);

  const handleStateChange = (newState: string) => {
    setState(newState);
    setCategory('');
    setSubCategory('');
    setQuota('');
    setResponse(null);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setSubCategory('');
    setQuota('');
    setResponse(null);
  };

  const handleSubCategoryChange = (sub: string) => {
    setSubCategory(sub);
    setResponse(null);
  };

  const stateCategories = state && stateMeta[state] ? stateMeta[state].categories : [];
  const stateQuotasRaw: string[] = state && stateMeta[state] ? stateMeta[state].quotas : [];
  const stateQuotas: string[] = Array.from(
    new Map(stateQuotasRaw.map(q => [normalizeQuotaKey(q), normalizeQuotaLabel(q)])).values(),
  );
  const stateSubCatMap: Record<string, string[]> =
    (state && stateMeta[state]?.subCategoriesByCategory) || {};
  const availableSubCategories: string[] = category ? (stateSubCatMap[category] ?? []) : [];
  const showSubCategoryControl = Boolean(category);

  const handlePredict = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum <= 0 || rankNum > 2000000) {
      setError('Please enter a valid NEET rank between 1 and 20,00,000.');
      return;
    }
    setError('');
    setLoading(true);
    setResponse(null);
    setPage(1);
    try {
      const params = new URLSearchParams({ rank });
      if (state) params.set('state', state);
      if (category) params.set('category', category);
      if (subCategory) params.set('subCategory', subCategory);
      if (quota) params.set('quota', quota);
      const res = await fetch('/api/college-predictor?' + params.toString());
      const data = await res.json();
      if (res.ok) {
        setResponse(data);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [rank, state, category, subCategory, quota]);

  const paginatedResults = response ? response.results.slice(0, page * ITEMS_PER_PAGE) : [];
  const hasMore = response ? paginatedResults.length < response.results.length : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#0D1B3E] py-12 sm:py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F26419]/20 border border-[#F26419]/40 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F26419] inline-block" />
            <span className="text-[#F26419] text-sm font-semibold">NEET UG 2025 · 21 States · Final Cutoffs</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            MBBS College <span className="text-[#F26419]">Predictor</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Enter your NEET 2025 rank, select your state to see all available categories and quotas, then predict eligible colleges instantly.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handlePredict} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                NEET 2025 Rank <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="2000000"
                value={rank}
                onChange={e => { setRank(e.target.value); setResponse(null); }}
                placeholder="e.g. 50000"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26419]/50 focus:border-[#F26419] text-gray-900 text-base transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  State <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select
                  value={state}
                  onChange={e => handleStateChange(e.target.value)}
                  disabled={metaLoading}
                  className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26419]/50 focus:border-[#F26419] text-gray-900 text-sm bg-white appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">All States</option>
                  {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Category
                  {state && (
                    <span className="ml-1 text-xs text-[#F26419] font-normal">({stateCategories.length})</span>
                  )}
                </label>
                <select
                  value={category}
                  onChange={e => handleCategoryChange(e.target.value)}
                  disabled={metaLoading}
                  className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26419]/50 focus:border-[#F26419] text-gray-900 text-sm bg-white appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">All Categories</option>
                  {(state ? stateCategories : []).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {state.length === 0 && <option disabled>— Select a state first —</option>}
                </select>
                {state.length === 0 && (
                  <p className="mt-1 text-xs text-gray-400">Select a state to see its categories</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Quota
                  {state && stateQuotas.length > 1 && (
                    <span className="ml-1 text-xs text-[#F26419] font-normal">({stateQuotas.length})</span>
                  )}
                </label>
                <select
                  value={quota}
                  onChange={e => { setQuota(e.target.value); setResponse(null); }}
                  disabled={metaLoading || state.length === 0}
                  className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26419]/50 focus:border-[#F26419] text-gray-900 text-sm bg-white appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">All Quotas</option>
                  {stateQuotas.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>

            {showSubCategoryControl && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Sub Category
                  <span className="ml-1 text-xs text-[#F26419] font-normal">
                    ({availableSubCategories.length > 0 ? `${availableSubCategories.length} available` : 'Not available for this category'})
                  </span>
                </label>
                <select
                  value={subCategory}
                  onChange={e => handleSubCategoryChange(e.target.value)}
                  disabled={metaLoading || availableSubCategories.length === 0}
                  className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F26419]/50 focus:border-[#F26419] text-gray-900 text-sm bg-white appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">{availableSubCategories.length > 0 ? 'All Sub Categories' : 'No sub categories for this category'}</option>
                  {availableSubCategories.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {availableSubCategories.length === 0 && (
                  <p className="mt-1 text-xs text-gray-400">This state/category combination only has base category entries in source cutoff data.</p>
                )}
              </div>
            )}

            {(state || category || subCategory || quota) && (
              <div className="flex flex-wrap gap-2">
                {state && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    📍 {state}
                    <button type="button" onClick={() => handleStateChange('')} className="hover:text-blue-900 font-bold">×</button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                    🏷 {category}
                    <button type="button" onClick={() => handleCategoryChange('')} className="hover:text-purple-900 font-bold">×</button>
                  </span>
                )}
                {subCategory && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                    🔖 {subCategory}
                    <button type="button" onClick={() => handleSubCategoryChange('')} className="hover:text-indigo-900 font-bold">×</button>
                  </span>
                )}
                {quota && (
                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                    🎟 {quota}
                    <button type="button" onClick={() => { setQuota(''); setResponse(null); }} className="hover:text-green-900 font-bold">×</button>
                  </span>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || metaLoading}
              className="w-full h-12 rounded-xl bg-[#F26419] text-white font-bold text-base hover:bg-[#FF8040] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Predicting...
                </>
              ) : 'Predict My Colleges →'}
            </button>
          </form>
        </div>
      </section>

      {response && (
        <section ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {response.totalMatches > 0
                  ? response.totalMatches.toLocaleString() + ' College' + (response.totalMatches === 1 ? '' : 's') + ' Found'
                  : 'No Colleges Found'}
              </h2>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Rank: <strong>{response.rank.toLocaleString()}</strong></span>
                {response.state !== 'All States' && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">📍 {response.state}</span>}
                {response.category !== 'All' && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">🏷 {response.category}</span>}
                {response.subCategory && <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">🔖 {response.subCategory}</span>}
                {response.quota !== 'All' && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">🎟 {response.quota}</span>}
              </div>
            </div>
            {response.totalMatches > 0 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-green-700 text-xs font-medium">NEET UG 2025 Final Cutoffs</span>
              </div>
            )}
          </div>

          {response.totalMatches === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No matching colleges found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Try removing category/quota filters, selecting &quot;All States&quot;, or explore MBBS abroad options.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-[#F26419] text-white text-sm font-bold hover:bg-[#FF8040] transition-colors">
                Get Free Counselling
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0D1B3E] text-white">
                        <th className="text-left px-4 py-3 font-semibold w-8">#</th>
                        <th className="text-left px-4 py-3 font-semibold min-w-[280px]">College Name</th>
                        <th className="text-left px-4 py-3 font-semibold min-w-[130px]">State</th>
                        <th className="text-left px-4 py-3 font-semibold min-w-[100px]">Category</th>
                        <th className="text-left px-4 py-3 font-semibold min-w-[110px]">Sub Category</th>
                        <th className="text-left px-4 py-3 font-semibold min-w-[110px]">Closing Rank</th>
                        <th className="text-left px-4 py-3 font-semibold min-w-[130px]">Quota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedResults.map((result, i) => (
                        <tr key={i} className={'border-t border-gray-100 ' + (i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50') + ' hover:bg-orange-50/30 transition-colors'}>
                          <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 text-gray-900 font-medium leading-tight">{result.college}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-100 whitespace-nowrap">{result.state}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-100 whitespace-nowrap">{result.category}</span>
                            {result.rawCategory !== result.category && (
                              <div className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">{result.rawCategory}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {result.subCategory
                              ? <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full border border-indigo-100 whitespace-nowrap">{result.subCategory}</span>
                              : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3"><span className="font-semibold text-gray-800">{result.closingRank.toLocaleString()}</span></td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{result.quota}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="h-10 px-8 rounded-full border-2 border-[#F26419] text-[#F26419] text-sm font-bold hover:bg-[#F26419] hover:text-white transition-colors"
                  >
                    Load More ({response.results.length - paginatedResults.length} remaining)
                  </button>
                </div>
              )}

              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                <p className="font-semibold mb-1">⚠️ Important Disclaimer</p>
                <p>This predictor uses <strong>NEET UG 2025 final round cutoff data</strong>. Categories and quotas are shown exactly as per official state counselling data. Eligibility may vary — consult a counsellor for personalised guidance.</p>
                <Link href="/contact" className="inline-block mt-2 text-[#F26419] font-semibold hover:underline">Book free counselling →</Link>
              </div>
            </>
          )}
        </section>
      )}

      {(response === null) && (loading === false) && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🏥', title: '21 States', desc: 'AP, Bihar, Gujarat, Karnataka, MH, Rajasthan & more' },
              { icon: '🏷', title: 'All Categories', desc: 'GEN, OBC, SC, ST, EWS, PH, and all state-specific sub-categories' },
              { icon: '🎟', title: 'All Quota Types', desc: 'State, Govt, Private, NRI, CTB, Management & Minority quotas' },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{card.title}</div>
                <div className="text-gray-500 text-xs mt-1">{card.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
