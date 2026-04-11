import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const getReviews = async (params = {}) => {
  const res = await api.get("/reviews", { params });
  return res.data;
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetReviews = async (params = {}) => {
  const res = await adminApi.get("/reviews", { params: { status: "all", ...params } });
  return res.data;
};

export const createReview = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/reviews", data);
  return res.data;
};

export const updateReview = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/reviews/${id}`, data);
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await adminApi.delete(`/reviews/${id}`);
  return res.data;
};

export const updateReviewMeta = async (averageRating: number, totalReviews: number) => {
  const res = await adminApi.put("/reviews/meta", { averageRating, totalReviews });
  return res.data;
};
