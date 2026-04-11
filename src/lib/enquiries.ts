import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const submitEnquiry = async (data: Record<string, unknown>) => {
  const res = await api.post("/enquiries", data);
  return res.data;
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const getEnquiries = async (params = {}) => {
  const res = await adminApi.get("/enquiries", { params });
  return res.data;
};

export const updateEnquiry = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/enquiries/${id}`, data);
  return res.data;
};
