// lib/auth.ts
import { api, adminApi } from "./api";

// ─── LOGIN ───────────────────────────────────────────────────
export const loginAdmin = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("amw_token", res.data.data.token);
  localStorage.setItem("amw_refresh_token", res.data.data.refreshToken);
  localStorage.setItem("amw_user", JSON.stringify(res.data.data.user));
  return res.data.data;
};

// ─── LOGOUT ──────────────────────────────────────────────────
export const logoutAdmin = async () => {
  try {
    await adminApi.post("/auth/logout");
  } catch {
    // ignore
  }
  localStorage.removeItem("amw_token");
  localStorage.removeItem("amw_refresh_token");
  localStorage.removeItem("amw_user");
};

// ─── REFRESH TOKEN ────────────────────────────────────────────
export const refreshToken = async () => {
  const rt = localStorage.getItem("amw_refresh_token");
  const res = await api.post("/auth/refresh", { refreshToken: rt });
  localStorage.setItem("amw_token", res.data.data.token);
  if (res.data.data.refreshToken) {
    localStorage.setItem("amw_refresh_token", res.data.data.refreshToken);
  }
  return res.data.data.token;
};

// ─── GET LOGGED IN USER ───────────────────────────────────────
export const getAdminUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("amw_user");
  return user ? JSON.parse(user) : null;
};

// ─── CHECK IF LOGGED IN ───────────────────────────────────────
export const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("amw_token");
};
