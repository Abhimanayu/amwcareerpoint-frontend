import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const getCountries = async (params = {}) => {
  const res = await api.get("/countries", { params });
  return res.data;
};

export const getCountryBySlug = async (slug: string) => {
  const res = await api.get(`/countries/${slug}`);
  return res.data;
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetCountries = async (params = {}) => {
  const res = await adminApi.get("/countries", { params: { status: "all", ...params } });
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
