import { api, adminApi } from "./api";
import type { HomeSettings } from "./homeSettings";

type HomeSettingsContentPayload = Pick<HomeSettings, "seo" | "hero" | "stats" | "sections">;

function unwrapHomeSettings(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;

  const root = payload as { data?: unknown };
  return root.data ?? payload;
}

export const getHomeSettings = async () => {
  const res = await api.get("/home-settings");
  return unwrapHomeSettings(res.data);
};

export const adminGetHomeSettings = async () => {
  const res = await adminApi.get("/home-settings/admin");
  return unwrapHomeSettings(res.data);
};

export const updateHomeSettings = async (data: HomeSettingsContentPayload) => {
  const res = await adminApi.put("/home-settings", data);
  return unwrapHomeSettings(res.data);
};

export const updateHomeItems = async (data: {
  homeCountries: string[];
  homeUniversities: string[];
  homeBlogs: string[];
}) => {
  const res = await adminApi.put("/home-settings/home-items", data);
  return unwrapHomeSettings(res.data);
};
