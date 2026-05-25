import { api, adminApi } from "./api";
import axios from 'axios';

export interface DeleteFaqResult {
  deleted: boolean;
  alreadyDeleted: boolean;
  message?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && typeof value === 'object'
);

const getMessage = (value: Record<string, unknown>): string | undefined => (
  typeof value.message === 'string' ? value.message : undefined
);

const hasNotFoundMessage = (message?: string): boolean => (
  typeof message === 'string' && /not found|already removed|already deleted|does not exist/i.test(message)
);

const fromDeletedCount = (deletedCount: unknown, message?: string): DeleteFaqResult | null => {
  if (typeof deletedCount !== 'number') {
    return null;
  }

  if (deletedCount > 0) {
    return { deleted: true, alreadyDeleted: false };
  }

  return { deleted: false, alreadyDeleted: true, message };
};

const fromSuccessFlag = (body: Record<string, unknown>, message?: string): DeleteFaqResult | null => {
  if (body.success !== false) {
    return null;
  }

  if (hasNotFoundMessage(message)) {
    return { deleted: false, alreadyDeleted: true, message };
  }

  throw new Error(message || 'Failed to delete FAQ.');
};

const extractDeleteFaqResult = (payload: unknown): DeleteFaqResult => {
  if (!isRecord(payload)) {
    return { deleted: true, alreadyDeleted: false };
  }

  const body = payload;
  const bodyMessage = getMessage(body);

  if (isRecord(body.data)) {
    const nestedMessage = getMessage(body.data);
    const nestedResult = fromDeletedCount(body.data.deletedCount, nestedMessage);
    if (nestedResult) {
      return nestedResult;
    }
  }

  const topLevelDeletedCount = fromDeletedCount(body.deletedCount, bodyMessage);
  if (topLevelDeletedCount) {
    return topLevelDeletedCount;
  }

  const successFlagResult = fromSuccessFlag(body, bodyMessage);
  if (successFlagResult) {
    return successFlagResult;
  }

  if (hasNotFoundMessage(bodyMessage)) {
    return { deleted: false, alreadyDeleted: true, message: bodyMessage };
  }

  return { deleted: true, alreadyDeleted: false, message: bodyMessage };
};

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
  try {
    const res = await adminApi.delete(`/faqs/${id}`);
    return extractDeleteFaqResult(res.data);
  } catch (err) {
    if (!axios.isAxiosError(err)) {
      throw err;
    }

    // Some deployments only accept id in query/body for delete.
    if (![400, 404, 405].includes(err.response?.status ?? 0)) {
      throw err;
    }

    const fallbackAttempts = [
      () => adminApi.delete('/faqs', { params: { id } }),
      () => adminApi.delete('/faqs', { data: { id } }),
      () => adminApi.delete(`/faqs/delete/${id}`),
    ];

    for (const attempt of fallbackAttempts) {
      try {
        const res = await attempt();
        return extractDeleteFaqResult(res.data);
      } catch {}
    }

    throw err;
  }
};

export const reorderFaqs = async (items: { id: string; sortOrder: number }[]) => {
  const res = await adminApi.put("/faqs/reorder", { items });
  return res.data;
};
