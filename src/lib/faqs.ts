import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const getFaqs = async (params: { page: string; pageSlug?: string }) => {
  const { page, ...rest } = params;
  const res = await api.get("/faqs", { params: { faqPage: page, ...rest } });
  return res.data;
};

export const getFaqById = async (id: string) => {
  const res = await adminApi.get(`/faqs/${id}`);
  return res.data;
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetFaqs = async (params = {}) => {
  const res = await adminApi.get("/faqs", { params: { status: "all", ...params } });
  return res.data;
};

export const createFaq = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/faqs", data);
  return res.data;
};

export const updateFaq = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/faqs/${id}`, data);
  return res.data;
};

export const deleteFaq = async (id: string) => {
  const res = await adminApi.delete(`/faqs/${id}`);
  return res.data;
};

export const reorderFaqs = async (items: { id: string; sortOrder: number }[]) => {
  const res = await adminApi.put("/faqs/reorder", { items });
  return res.data;
};
