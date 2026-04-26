import { cache } from "react";
import { api, adminApi } from "./api";

type CountriesParams = Record<string, unknown>;

const CLIENT_COUNTRIES_TTL_MS = 30_000;
const CLIENT_COUNTRIES_SHARED_MIN_LIMIT = 12;

let clientCountriesCache: { limit: number; payload: unknown; timestamp: number } | null = null;
let clientCountriesInflight: { limit: number; promise: Promise<unknown> } | null = null;

function isBrowser() {
  return "window" in globalThis;
}

function getLimitValue(params: CountriesParams) {
  const raw = params.limit;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }

  if (typeof raw === "string") {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }
  }

  return null;
}

function hasOnlyLimitParam(params: CountriesParams) {
  const keys = Object.keys(params);
  return keys.every((key) => key === "limit");
}

function readCountriesArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const root = payload as { data?: unknown; countries?: unknown };

  if (Array.isArray(root.data)) {
    return root.data;
  }

  if (root.data && typeof root.data === "object") {
    const dataObj = root.data as { countries?: unknown };
    if (Array.isArray(dataObj.countries)) {
      return dataObj.countries;
    }
  }

  if (Array.isArray(root.countries)) {
    return root.countries;
  }

  return [];
}

function sliceCountriesPayload(payload: unknown, limit: number) {
  if (limit <= 0) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.slice(0, limit);
  }

  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const root = payload as { data?: unknown; countries?: unknown };

  if (Array.isArray(root.data)) {
    return { ...root, data: root.data.slice(0, limit) };
  }

  if (root.data && typeof root.data === "object") {
    const dataObj = root.data as { countries?: unknown };
    if (Array.isArray(dataObj.countries)) {
      return {
        ...root,
        data: {
          ...dataObj,
          countries: dataObj.countries.slice(0, limit),
        },
      };
    }
  }

  if (Array.isArray(root.countries)) {
    return { ...root, countries: root.countries.slice(0, limit) };
  }

  return payload;
}

// ─── FRONTEND ─────────────────────────────────────────────────
export const getCountries = async (params = {}) => {
  const queryParams = params as CountriesParams;
  const requestedLimit = getLimitValue(queryParams);
  const canUseClientSharedCache = isBrowser() && hasOnlyLimitParam(queryParams) && requestedLimit !== null;
  const networkLimit = canUseClientSharedCache
    ? Math.max(requestedLimit, CLIENT_COUNTRIES_SHARED_MIN_LIMIT)
    : requestedLimit;

  if (canUseClientSharedCache && clientCountriesCache) {
    const cacheIsFresh = Date.now() - clientCountriesCache.timestamp < CLIENT_COUNTRIES_TTL_MS;
    if (cacheIsFresh && clientCountriesCache.limit >= requestedLimit) {
      return sliceCountriesPayload(clientCountriesCache.payload, requestedLimit);
    }
  }

  if (canUseClientSharedCache && clientCountriesInflight && clientCountriesInflight.limit >= requestedLimit) {
    return clientCountriesInflight.promise.then((payload) =>
      sliceCountriesPayload(payload, requestedLimit)
    );
  }

  const requestParams =
    canUseClientSharedCache && networkLimit !== null
      ? { ...queryParams, limit: networkLimit }
      : queryParams;

  const requestPromise = api.get("/countries", { params: requestParams }).then((res) => res.data);

  if (!canUseClientSharedCache) {
    return requestPromise;
  }

  clientCountriesInflight = {
    limit: networkLimit,
    promise: requestPromise,
  };

  try {
    const payload = await requestPromise;
    const countryCount = readCountriesArray(payload).length;
    const storedLimit = Math.max(networkLimit ?? requestedLimit, countryCount);

    clientCountriesCache = {
      limit: storedLimit,
      payload,
      timestamp: Date.now(),
    };

    return sliceCountriesPayload(payload, requestedLimit);
  } finally {
    if (clientCountriesInflight?.promise === requestPromise) {
      clientCountriesInflight = null;
    }
  }
};

export const getCountryBySlug = cache(async (slug: string) => {
  const res = await api.get(`/countries/${slug}`);
  return res.data;
});

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetCountries = async (params = {}) => {
  const res = await adminApi.get("/countries", { params: { status: "all", ...params } });
  return res.data;
};

export const adminGetCountryById = async (id: string) => {
  const res = await adminApi.get(`/countries/admin/${id}`);
  return res.data;
};

export const createCountry = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/countries", data);
  return res.data;
};

export const updateCountry = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/countries/${id}`, data);
  return res.data;
};

export const deleteCountry = async (id: string) => {
  const res = await adminApi.delete(`/countries/${id}`);
  return res.data;
};

export const reorderCountries = async (items: { id: string; sortOrder: number }[]) => {
  const res = await adminApi.put("/countries/reorder", { items });
  return res.data;
};
