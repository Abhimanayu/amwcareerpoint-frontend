const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

const TOKEN_KEY = 'amw_predictor_token';
const REFRESH_TOKEN_KEY = 'amw_predictor_refresh_token';
const USER_KEY = 'amw_predictor_user';

export type PredictorUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type PredictorAccess = {
  hasAccess: boolean;
  expiresAt: string | null;
  daysRemaining?: number | null;
  accessState?: string | null;
  isExpired?: boolean;
};

export type PredictorPlan = {
  currency: 'INR';
  baseAmountPaise: number;
  gstAmountPaise: number;
  amountPaise: number;
  gstPercent: number;
  accessDays: number;
  keyId: string | null;
  isPaymentConfigured: boolean;
};

export type PredictorMetadata = {
  state: string | null;
  category: string | null;
  states: string[];
  categories: string[];
  subCategories: string[];
  rawCategories: string[];
  quotas: string[];
  categoryOptions: Array<{
    category: string;
    subCategories: string[];
  }>;
};

export type PredictorResult = {
  state: string;
  college: string;
  rawCategory: string;
  category: string;
  subCategory: string | null;
  closingRank: number;
  quota: string;
};

export type PredictorSearchPayload = {
  rank: number;
  state?: string;
  category?: string;
  subCategory?: string;
  quota?: string;
  page?: number;
  limit?: number;
};

export type PredictorSearchResponse = {
  items: PredictorResult[];
  total: number;
  page: number;
  limit: number;
};

type SessionResponse = {
  token?: string;
  refreshToken?: string;
  user?: PredictorUser;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  hasActiveAccess?: boolean;
  accessExpiresAt?: string | null;
};

type ApiEnvelope<T> = {
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
};

export class PredictorApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'PredictorApiError';
    this.status = status;
    this.code = code;
  }
}

function hasBrowserStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function getToken() {
  if (!hasBrowserStorage()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken() {
  if (!hasBrowserStorage()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

function normalizeUser(session: SessionResponse): PredictorUser {
  if (session.user) return session.user;

  return {
    id: String(session.userId || ''),
    name: session.name || 'Student',
    email: session.email || '',
    phone: session.phone,
  };
}

function saveSession(session: SessionResponse) {
  if (!hasBrowserStorage() || !session.token) return;
  const user = normalizeUser(session);
  window.localStorage.setItem(TOKEN_KEY, session.token);
  if (session.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredPredictorUser(): PredictorUser | null {
  if (!hasBrowserStorage()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PredictorUser;
  } catch {
    clearPredictorSession();
    return null;
  }
}

export function clearPredictorSession() {
  if (!hasBrowserStorage()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retryWithRefresh = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retryWithRefresh && getRefreshToken()) {
    const refreshed = await refreshPredictorToken();
    if (refreshed) {
      return request<T>(path, options, false);
    }
  }

  const payload = await parseJson<ApiEnvelope<T>>(response);

  if (!response.ok) {
    throw new PredictorApiError(
      payload.error?.message || 'Something went wrong. Please try again.',
      response.status,
      payload.error?.code,
    );
  }

  return (payload.data ?? (payload as T)) as T;
}

export async function refreshPredictorToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/predictor/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    const payload = await parseJson<ApiEnvelope<SessionResponse>>(response);

    if (!response.ok || !payload.data?.token) {
      clearPredictorSession();
      return false;
    }

    const storedUser = getStoredPredictorUser();
    if (storedUser && !payload.data.user && !payload.data.email) {
      payload.data.user = storedUser;
    }
    saveSession(payload.data);
    return true;
  } catch {
    clearPredictorSession();
    return false;
  }
}

export async function registerPredictor(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const session = await request<SessionResponse>('/predictor/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...input, confirmPassword: input.password }),
  }, false);
  session.user = {
    id: String(session.userId || ''),
    name: input.name,
    email: session.email || input.email,
    phone: input.phone,
  };
  saveSession(session);
  return session;
}

export async function loginPredictor(input: { email: string; password: string }) {
  const session = await request<SessionResponse>('/predictor/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  }, false);
  saveSession(session);
  return session;
}

export async function logoutPredictor() {
  try {
    await request('/predictor/auth/logout', { method: 'POST' }, false);
  } finally {
    clearPredictorSession();
  }
}

export async function getPredictorMe() {
  const data = await request<SessionResponse>('/predictor/auth/me');
  const user = normalizeUser(data);
  if (hasBrowserStorage()) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return user;
}

export function hasPredictorToken() {
  return Boolean(getToken());
}

export async function getPredictorAccess() {
  return request<PredictorAccess>('/predictor/access');
}

export async function getPredictorPlan() {
  return request<PredictorPlan>('/predictor/payment/plan', {}, false);
}

export async function getPredictorMetadata(params: { state?: string; category?: string } = {}) {
  const searchParams = new URLSearchParams();
  if (params.state) searchParams.set('state', params.state);
  if (params.category) searchParams.set('category', params.category);

  const query = searchParams.toString();
  return request<PredictorMetadata>(`/predictor/metadata${query ? `?${query}` : ''}`, {}, false);
}

export async function searchPredictor(payload: PredictorSearchPayload) {
  const response = await request<{
    items: PredictorResult[];
    pagination: { page: number; limit: number; total: number };
  }>('/predictor/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    items: response.items,
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
  };
}

export async function createPredictorOrder() {
  return request<PredictorPlan & { orderId: string; paymentRecordId: string }>('/predictor/payment/create-order', {
    method: 'POST',
  });
}

export async function verifyPredictorPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return request<{ status: string; accessExpiresAt: string; accessDays: number }>('/predictor/payment/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
