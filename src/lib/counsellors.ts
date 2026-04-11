import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const getCounsellors = async (params = {}) => {
  const res = await api.get("/counsellors", { params });
  return res.data;
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetCounsellors = async (params = {}) => {
  const res = await adminApi.get("/counsellors", { params: { status: "all", ...params } });
  return res.data;
};

export const createCounsellor = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/counsellors", data);
  return res.data;
};

export const updateCounsellor = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/counsellors/${id}`, data);
  return res.data;
};

export const deleteCounsellor = async (id: string) => {
  const res = await adminApi.delete(`/counsellors/${id}`);
  return res.data;
};
