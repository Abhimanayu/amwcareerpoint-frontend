import { cache } from "react";
import { api, adminApi } from "./api";

type UniversitiesParams = Record<string, unknown>;

const CLIENT_UNIVERSITIES_TTL_MS = 30_000;

const clientUniversitiesCache: Map<string, { payload: unknown; timestamp: number }> = new Map();
const clientUniversitiesInflight: Map<string, Promise<unknown>> = new Map();

function isBrowser() {
  return "window" in globalThis;
}

function normalizeParams(params: UniversitiesParams) {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b));

  return JSON.stringify(entries);
}

// ─── FRONTEND ─────────────────────────────────────────────────
export const getUniversities = async (params = {}) => {
  const queryParams = params as UniversitiesParams;

  if (!isBrowser()) {
    const res = await api.get("/universities", { params: queryParams });
    return res.data;
  }

  const key = normalizeParams(queryParams);
  const cached = clientUniversitiesCache.get(key);
  if (cached && Date.now() - cached.timestamp < CLIENT_UNIVERSITIES_TTL_MS) {
    return cached.payload;
  }

  const inflight = clientUniversitiesInflight.get(key);
  if (inflight) {
    return inflight;
  }

  const requestPromise = api.get("/universities", { params: queryParams }).then((res) => res.data);
  clientUniversitiesInflight.set(key, requestPromise);

  try {
    const payload = await requestPromise;
    clientUniversitiesCache.set(key, {
      payload,
      timestamp: Date.now(),
    });
    return payload;
  } finally {
    if (clientUniversitiesInflight.get(key) === requestPromise) {
      clientUniversitiesInflight.delete(key);
    }
  }
};

export const getUniversityBySlug = cache(async (slug: string) => {
  const res = await api.get(`/universities/${slug}`);
  return res.data;
});

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetUniversities = async (params = {}) => {
  const res = await adminApi.get("/universities", { params: { status: "all", ...params } });
  return res.data;
};

export const adminGetUniversityById = async (id: string) => {
  const res = await adminApi.get(`/universities/admin/${id}`);
  return res.data;
};

export const createUniversity = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/universities", data);
  return res.data;
};

export const updateUniversity = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/universities/${id}`, data);
  return res.data;
};

export const deleteUniversity = async (id: string) => {
  const res = await adminApi.delete(`/universities/${id}`);
  return res.data;
};
