import { cache } from "react";
import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const getUniversities = async (params = {}) => {
  const res = await api.get("/universities", { params });
  return res.data;
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
