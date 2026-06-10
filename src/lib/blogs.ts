import { cache } from "react";
import { api, adminApi } from "./api";
import {
  getServerCached,
  invalidateServerCacheByPrefix,
  normalizeCacheParams,
} from "./serverRequestCache";

type BlogsParams = Record<string, unknown>;

const CLIENT_BLOGS_TTL_MS = 120_000;

const clientBlogsCache: Map<string, { payload: unknown; timestamp: number }> = new Map();
const clientBlogsInflight: Map<string, Promise<unknown>> = new Map();

function invalidateBlogsCache() {
  clientBlogsCache.clear();
  clientBlogsInflight.clear();
  invalidateServerCacheByPrefix([
    "blogs:list:",
    "blogs:slug:",
    "blogs:categories",
  ]);
}

function isBrowser() {
  return "window" in globalThis;
}

function normalizeParams(params: BlogsParams) {
  return normalizeCacheParams(params);
}

// ─── FRONTEND ─────────────────────────────────────────────────
export const getBlogs = async (params = {}) => {
  const queryParams: BlogsParams = params;

  if (!isBrowser()) {
    return getServerCached(
      `blogs:list:${normalizeParams(queryParams)}`,
      () => api.get("/blogs", { params: queryParams }).then((res) => res.data)
    );
  }

  const key = normalizeParams(queryParams);
  const cached = clientBlogsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CLIENT_BLOGS_TTL_MS) {
    return cached.payload;
  }

  const inflight = clientBlogsInflight.get(key);
  if (inflight) {
    return inflight;
  }

  const requestPromise = api.get("/blogs", { params: queryParams }).then((res) => res.data);
  clientBlogsInflight.set(key, requestPromise);

  try {
    const payload = await requestPromise;
    clientBlogsCache.set(key, {
      payload,
      timestamp: Date.now(),
    });
    return payload;
  } finally {
    if (clientBlogsInflight.get(key) === requestPromise) {
      clientBlogsInflight.delete(key);
    }
  }
};

export const getBlogBySlug = cache(async (slug: string) => {
  return getServerCached(
    `blogs:slug:${slug}`,
    () => api.get(`/blogs/${slug}`).then((res) => res.data)
  );
});

export const getBlogCategories = async () => {
  return getServerCached(
    "blogs:categories",
    () => api.get("/blog-categories").then((res) => res.data)
  );
};

// ─── ADMIN PANEL ──────────────────────────────────────────────
export const adminGetBlogs = async (params = {}) => {
  const res = await adminApi.get("/blogs/admin/list", { params: { status: "all", ...params } });
  return res.data;
};

export const adminGetBlogById = async (id: string) => {
  const res = await adminApi.get(`/blogs/admin/${id}`);
  return res.data;
};

export const createBlog = async (data: Record<string, unknown>) => {
  const res = await adminApi.post("/blogs", data);
  invalidateBlogsCache();
  return res.data;
};

export const updateBlog = async (id: string, data: Record<string, unknown>) => {
  const res = await adminApi.put(`/blogs/${id}`, data);
  invalidateBlogsCache();
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await adminApi.delete(`/blogs/${id}`);
  invalidateBlogsCache();
  return res.data;
};

// ─── BLOG CATEGORIES (Admin) ──────────────────────────────────
export const createBlogCategory = async (name: string) => {
  const res = await adminApi.post("/blog-categories", { name });
  invalidateBlogsCache();
  return res.data;
};

export const updateBlogCategory = async (id: string, name: string) => {
  const res = await adminApi.put(`/blog-categories/${id}`, { name });
  invalidateBlogsCache();
  return res.data;
};

export const deleteBlogCategory = async (id: string) => {
  const res = await adminApi.delete(`/blog-categories/${id}`);
  invalidateBlogsCache();
  return res.data;
};
