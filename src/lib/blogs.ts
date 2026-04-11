import { api, adminApi } from "./api";

// ─── FRONTEND ─────────────────────────────────────────────────
export const getBlogs = async (params = {}) => {
  const res = await api.get("/blogs", { params });
  return res.data;
};

export const getBlogBySlug = async (slug: string) => {
  const res = await api.get(`/blogs/${slug}`);
  return res.data;
};

export const getBlogCategories = async () => {
  const res = await api.get("/blog-categories");
  return res.data;
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetBlogs = async (params = {}) => {
  const res = await adminApi.get("/blogs", { params: { status: "all", ...params } });
  return res.data;
};

export const createBlog = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/blogs", data);
  return res.data;
};

export const updateBlog = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/blogs/${id}`, data);
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await adminApi.delete(`/blogs/${id}`);
  return res.data;
};

// ─── BLOG CATEGORIES (Admin) ──────────────────────────────────
export const createBlogCategory = async (name: string) => {
  const res = await adminApi.post("/blog-categories", { name });
  return res.data;
};

export const updateBlogCategory = async (id: string, name: string) => {
  const res = await adminApi.put(`/blog-categories/${id}`, { name });
  return res.data;
};

export const deleteBlogCategory = async (id: string) => {
  const res = await adminApi.delete(`/blog-categories/${id}`);
  return res.data;
};
