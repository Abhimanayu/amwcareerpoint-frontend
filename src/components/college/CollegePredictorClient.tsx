'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';
import Link from 'next/link';
import {
  PredictorApiError,
  type PredictorAccess,
  type PredictorMetadata,
  type PredictorPlan,
  type PredictorResult,
  type PredictorSearchResponse,
  type PredictorUser,
  clearPredictorSession,
  createPredictorOrder,
  getPredictorAccess,
  getPredictorMe,
  getPredictorMetadata,
  getPredictorPlan,
  getStoredPredictorUser,
  hasPredictorToken,
  loginPredictor,
  logoutPredictor,
  registerPredictor,
  searchPredictor,
  verifyPredictorPayment,
} from '@/lib/predictorApi';

const ITEMS_PER_PAGE = 25;

type AuthMode = 'login' | 'register';

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function formatMoney(paise: number) {
  return `Rs. ${(paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not active';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (error instanceof PredictorApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type ResultsSectionProps = {
  response: PredictorSearchResponse;
  rank: number;
  selectedState: string;
  selectedCategory: string;
  selectedSubCategory: string;
  selectedQuota: string;
  resultsRef: RefObject<HTMLDivElement | null>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

function ResultsSection({
  response,
  rank,
  selectedState,
  selectedCategory,
  selectedSubCategory,
  selectedQuota,
  resultsRef,
  page,
  setPage,
}: Readonly<ResultsSectionProps>) {
  const visibleResults = response.items.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = visibleResults.length < response.items.length;
  const resultLabel = response.total === 1 ? 'College Found' : 'Colleges Found';

  return (
    <section ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {response.total.toLocaleString('en-IN')} {resultLabel}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              Rank: <strong>{rank.toLocaleString('en-IN')}</strong>
            </span>
            {selectedState && (
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                {selectedState}
              </span>
            )}
            {selectedCategory && (
              <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                {selectedCategory}
              </span>
            )}
            {selectedSubCategory && (
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                {selectedSubCategory}
              </span>
            )}
            {selectedQuota && (
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                {selectedQuota}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span className="text-green-700 text-xs font-medium">Backend cutoff API</span>
        </div>
      </div>

      {response.total === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">No matching colleges found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Try removing category or quota filters, or select a different state.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-orange text-white text-sm font-bold hover:bg-orange-hover transition-colors"
          >
            Get Counselling Help
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0D1B3E] text-white">
                    <th className="text-left px-4 py-3 font-semibold w-10">#</th>
                    <th className="text-left px-4 py-3 font-semibold min-w-72">College Name</th>
                    <th className="text-left px-4 py-3 font-semibold min-w-36">State</th>
                    <th className="text-left px-4 py-3 font-semibold min-w-28">Category</th>
                    <th className="text-left px-4 py-3 font-semibold min-w-32">Sub Category</th>
                    <th className="text-left px-4 py-3 font-semibold min-w-32">Closing Rank</th>
                    <th className="text-left px-4 py-3 font-semibold min-w-36">Quota</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleResults.map((result: PredictorResult, index) => (
                    <tr
                      key={`${result.state}-${result.college}-${result.rawCategory}-${result.closingRank}-${result.quota}-${index}`}
                      className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-orange-50/30 transition-colors`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium leading-tight">{result.college}</td>
                      <td className="px-4 py-3 text-gray-600">{result.state}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-100 whitespace-nowrap">
                          {result.category}
                        </span>
                        {result.rawCategory !== result.category && (
                          <div className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">{result.rawCategory}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{result.subCategory || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-800">{result.closingRank.toLocaleString('en-IN')}</span>
                      </td>
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
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="h-10 px-8 rounded-full border-2 border-orange text-orange text-sm font-bold hover:bg-orange hover:text-white transition-colors"
              >
                Load More ({response.items.length - visibleResults.length} remaining)
              </button>
            </div>
          )}

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <p className="font-semibold mb-1">Important disclaimer</p>
            <p>
              This predictor uses imported NEET cutoff records from the backend. Counselling rules and eligibility can
              change, so use this as guidance and verify final options with a counsellor.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function AccessPanel({
  user,
  access,
  plan,
  authMode,
  authLoading,
  paymentLoading,
  authError,
  authMessage,
  form,
  setAuthMode,
  setForm,
  onAuthSubmit,
  onLogout,
  onPay,
}: Readonly<{
  user: PredictorUser | null;
  access: PredictorAccess | null;
  plan: PredictorPlan | null;
  authMode: AuthMode;
  authLoading: boolean;
  paymentLoading: boolean;
  authError: string;
  authMessage: string;
  form: { name: string; email: string; phone: string; password: string };
  setAuthMode: (mode: AuthMode) => void;
  setForm: Dispatch<SetStateAction<{ name: string; email: string; phone: string; password: string }>>;
  onAuthSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
  onPay: () => void;
}>) {
  const hasAccess = Boolean(access?.hasAccess);

  return (
    <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {user ? (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Signed in as</p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 break-all">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="h-9 px-4 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-orange hover:text-orange transition-colors"
            >
              Logout
            </button>
          </div>

          <div className={`rounded-xl border p-4 ${hasAccess ? 'border-green-200 bg-green-50' : 'border-orange/30 bg-orange/5'}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{hasAccess ? 'Predictor access active' : 'Predictor access required'}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {hasAccess
                    ? `Valid until ${formatDate(access?.expiresAt)}`
                    : 'Buy access to unlock college results.'}
                </p>
              </div>
              {hasAccess && access?.daysRemaining !== null && access?.daysRemaining !== undefined && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
                  {access.daysRemaining} day{access.daysRemaining === 1 ? '' : 's'} left
                </span>
              )}
            </div>
          </div>

          {!hasAccess && (
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">College Predictor Plan</p>
                  <p className="text-xs text-gray-500 mt-1">{plan?.accessDays || 7} days access after payment</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-gray-900">{formatMoney(plan?.amountPaise || 58882)}</p>
                  <p className="text-[11px] text-gray-500">Includes GST</p>
                </div>
              </div>
              {plan && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <span className="block text-gray-400">Base</span>
                    {formatMoney(plan.baseAmountPaise)}
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <span className="block text-gray-400">GST {plan.gstPercent}%</span>
                    {formatMoney(plan.gstAmountPaise)}
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <span className="block text-gray-400">Validity</span>
                    {plan.accessDays} days
                  </div>
                </div>
              )}
              {!plan?.isPaymentConfigured && (
                <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Payment gateway is not configured yet. Add Razorpay keys on backend before live payments.
                </p>
              )}
              <button
                type="button"
                onClick={onPay}
                disabled={paymentLoading || !plan?.isPaymentConfigured}
                className="mt-4 w-full h-11 rounded-xl bg-orange text-white font-bold hover:bg-orange-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {paymentLoading ? 'Opening payment...' : 'Buy Access'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
            {(['login', 'register'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={`flex-1 h-9 rounded-lg text-sm font-bold capitalize transition-colors ${
                  authMode === mode ? 'bg-white text-orange shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <form onSubmit={onAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label htmlFor="predictor-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    id="predictor-name"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
                    required={authMode === 'register'}
                  />
                </div>
                <div>
                  <label htmlFor="predictor-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    id="predictor-phone"
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
                    inputMode="numeric"
                    maxLength={10}
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="predictor-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="predictor-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
                required
              />
            </div>
            <div>
              <label htmlFor="predictor-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="predictor-password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
                required
              />
              {authMode === 'register' && (
                <p className="mt-1 text-xs text-gray-400">Use 8+ characters with uppercase, number, and special character.</p>
              )}
            </div>

            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{authError}</div>
            )}
            {authMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{authMessage}</div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-11 rounded-xl bg-[#0D1B3E] text-white font-bold hover:bg-[#152a60] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}

export function CollegePredictorClient() {
  const [rank, setRank] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [quota, setQuota] = useState('');
  const [metadata, setMetadata] = useState<PredictorMetadata | null>(null);
  const [stateMetadata, setStateMetadata] = useState<PredictorMetadata | null>(null);
  const [user, setUser] = useState<PredictorUser | null>(null);
  const [access, setAccess] = useState<PredictorAccess | null>(null);
  const [plan, setPlan] = useState<PredictorPlan | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PredictorSearchResponse | null>(null);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const hasAccess = Boolean(access?.hasAccess);

  const selectedMetadata = state ? stateMetadata : metadata;
  const states = metadata?.states || [];
  const categories = selectedMetadata?.categories || [];
  const quotas = selectedMetadata?.quotas || [];
  const subCategories = selectedMetadata?.subCategories || [];
  const hasImportedData = states.length > 0;

  const activeRank = useMemo(() => {
    const parsed = Number.parseInt(rank, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [rank]);

  const refreshAccess = useCallback(async () => {
    if (!hasPredictorToken()) {
      setAccess(null);
      return;
    }

    try {
      const nextAccess = await getPredictorAccess();
      setAccess(nextAccess);
    } catch (err) {
      if (err instanceof PredictorApiError && err.status === 401) {
        clearPredictorSession();
        setUser(null);
        setAccess(null);
        return;
      }
      setAccess(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      setMetaLoading(true);
      try {
        const [rootMeta, planData] = await Promise.all([
          getPredictorMetadata(),
          getPredictorPlan(),
        ]);
        if (!mounted) return;
        setMetadata(rootMeta);
        setPlan(planData);
      } catch (err) {
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setMetaLoading(false);
      }

      if (!hasPredictorToken()) return;

      const storedUser = getStoredPredictorUser();
      if (storedUser && mounted) setUser(storedUser);

      try {
        const me = await getPredictorMe();
        if (!mounted) return;
        setUser(me);
        await refreshAccess();
      } catch {
        clearPredictorSession();
        if (mounted) {
          setUser(null);
          setAccess(null);
        }
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, [refreshAccess]);

  useEffect(() => {
    let mounted = true;

    async function loadStateMeta() {
      if (!state) {
        setStateMetadata(null);
        return;
      }

      setMetaLoading(true);
      try {
        const nextMeta = await getPredictorMetadata({ state, category });
        if (mounted) setStateMetadata(nextMeta);
      } catch (err) {
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setMetaLoading(false);
      }
    }

    loadStateMeta();
    return () => {
      mounted = false;
    };
  }, [state, category]);

  const handleAuthSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthMessage('');

    try {
      if (authMode === 'register') {
        await registerPredictor({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });
        setAuthMessage('Account created. You can buy access now.');
      } else {
        await loginPredictor({
          email: form.email.trim(),
          password: form.password,
        });
        setAuthMessage('Login successful.');
      }

      const nextUser = getStoredPredictorUser();
      setUser(nextUser);
      await refreshAccess();
      setForm((current) => ({ ...current, password: '' }));
    } catch (err) {
      setAuthError(getErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  }, [authMode, form, refreshAccess]);

  const handleLogout = useCallback(async () => {
    setAuthError('');
    setAuthMessage('');
    await logoutPredictor();
    setUser(null);
    setAccess(null);
    setResponse(null);
  }, []);

  const handlePayment = useCallback(async () => {
    if (!user || !plan?.isPaymentConfigured) return;

    setPaymentLoading(true);
    setError('');

    try {
      const ready = await loadRazorpayScript();
      if (!ready || !window.Razorpay) {
        setError('Payment checkout could not load. Please try again.');
        return;
      }

      const order = await createPredictorOrder();
      const checkout = new window.Razorpay({
        key: order.keyId || plan.keyId || '',
        amount: order.amountPaise,
        currency: order.currency,
        name: 'AMW Career Point',
        description: `College Predictor - ${order.accessDays} days access`,
        order_id: order.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#f97316' },
        handler: async (paymentResponse) => {
          try {
            await verifyPredictorPayment(paymentResponse);
            await refreshAccess();
            setAuthMessage('Payment successful. Predictor access is active.');
          } catch (err) {
            setError(getErrorMessage(err));
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });
      checkout.open();
    } catch (err) {
      setError(getErrorMessage(err));
      setPaymentLoading(false);
    }
  }, [plan, refreshAccess, user]);

  const handleStateChange = (nextState: string) => {
    setState(nextState);
    setCategory('');
    setSubCategory('');
    setQuota('');
    setResponse(null);
    setError('');
  };

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
    setSubCategory('');
    setQuota('');
    setResponse(null);
    setError('');
  };

  const handlePredict = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError('Please login or create an account first.');
      return;
    }

    if (!hasAccess) {
      setError('Please buy access to use the college predictor.');
      return;
    }

    if (activeRank <= 0 || activeRank > 2000000) {
      setError('Please enter a valid NEET rank between 1 and 20,00,000.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);
    setPage(1);

    try {
      const data = await searchPredictor({
        rank: activeRank,
        state: state || undefined,
        category: category || undefined,
        subCategory: subCategory || undefined,
        quota: quota || undefined,
        page: 1,
        limit: 100,
      });
      setResponse(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(getErrorMessage(err));
      if (err instanceof PredictorApiError && err.status === 403) {
        await refreshAccess();
      }
    } finally {
      setLoading(false);
    }
  }, [activeRank, category, hasAccess, quota, refreshAccess, state, subCategory, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#0D1B3E] py-12 sm:py-16 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/20 px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-orange inline-block" />
              <span className="text-orange text-sm font-semibold">Paid predictor - {plan?.accessDays || 7} days access</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              MBBS College <span className="text-orange">Predictor</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl">
              Login, unlock access, then search backend-managed NEET cutoff data by rank, state, category, sub category,
              and quota.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <form onSubmit={handlePredict} className="space-y-5">
              <div>
                <label htmlFor="predictor-rank" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  NEET rank <span className="text-red-500">*</span>
                </label>
                <input
                  id="predictor-rank"
                  type="number"
                  min="1"
                  max="2000000"
                  value={rank}
                  onChange={(event) => {
                    setRank(event.target.value);
                    setResponse(null);
                  }}
                  placeholder="e.g. 50000"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange text-gray-900 text-base transition-colors disabled:bg-gray-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="predictor-state" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    State
                  </label>
                  <select
                    id="predictor-state"
                    value={state}
                    onChange={(event) => handleStateChange(event.target.value)}
                    disabled={metaLoading || !hasImportedData}
                    className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange text-gray-900 text-sm bg-white disabled:opacity-60"
                  >
                    <option value="">All States</option>
                    {states.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="predictor-category" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    id="predictor-category"
                    value={category}
                    onChange={(event) => handleCategoryChange(event.target.value)}
                    disabled={metaLoading || !state}
                    className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange text-gray-900 text-sm bg-white disabled:opacity-60"
                  >
                    <option value="">All Categories</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {!state && <p className="mt-1 text-xs text-gray-400">Select a state to view categories.</p>}
                </div>

                <div>
                  <label htmlFor="predictor-sub-category" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Sub category
                  </label>
                  <select
                    id="predictor-sub-category"
                    value={subCategory}
                    onChange={(event) => {
                      setSubCategory(event.target.value);
                      setResponse(null);
                    }}
                    disabled={metaLoading || !category || subCategories.length === 0}
                    className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange text-gray-900 text-sm bg-white disabled:opacity-60"
                  >
                    <option value="">{subCategories.length ? 'All Sub Categories' : 'No sub categories'}</option>
                    {subCategories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="predictor-quota" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Quota
                  </label>
                  <select
                    id="predictor-quota"
                    value={quota}
                    onChange={(event) => {
                      setQuota(event.target.value);
                      setResponse(null);
                    }}
                    disabled={metaLoading || !state || quotas.length === 0}
                    className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange text-gray-900 text-sm bg-white disabled:opacity-60"
                  >
                    <option value="">All Quotas</option>
                    {quotas.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!hasImportedData && !metaLoading && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Predictor backend is connected, but cutoff data is not imported yet. Run the backend import script before
                  going live.
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || metaLoading || !hasAccess}
                className="w-full h-12 rounded-xl bg-orange text-white font-bold text-base hover:bg-orange-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Predicting...
                  </>
                ) : hasAccess ? 'Predict My Colleges' : 'Unlock Predictor to Search'}
              </button>
            </form>
          </div>

          <AccessPanel
            user={user}
            access={access}
            plan={plan}
            authMode={authMode}
            authLoading={authLoading}
            paymentLoading={paymentLoading}
            authError={authError}
            authMessage={authMessage}
            form={form}
            setAuthMode={setAuthMode}
            setForm={setForm}
            onAuthSubmit={handleAuthSubmit}
            onLogout={handleLogout}
            onPay={handlePayment}
          />
        </div>
      </section>

      {response && (
        <ResultsSection
          response={response}
          rank={activeRank}
          selectedState={state}
          selectedCategory={category}
          selectedSubCategory={subCategory}
          selectedQuota={quota}
          resultsRef={resultsRef}
          page={page}
          setPage={setPage}
        />
      )}

      {!response && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Backend managed', desc: 'Searches run through protected API endpoints.' },
              { title: 'Paid access', desc: 'Razorpay payment grants 7-day predictor access.' },
              { title: 'Login ready', desc: 'Users can register, login, logout, and keep access by token.' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
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
