import { adminApi } from "./api";

export interface UploadResult {
  url: string;
  publicId?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  folder?: string;
  uploadedAt?: string;
}

// POST /media/upload
export const uploadImage = async (file: File, folder: string): Promise<{ data: UploadResult }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await adminApi.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Normalize: backend may return { data: { url, publicId, ... } } or { url, ... }
  const payload = res.data?.data ?? res.data;
  return {
    data: {
      url: payload?.url ?? "",
      publicId: payload?.publicId,
      filename: payload?.filename,
      size: payload?.size,
      mimetype: payload?.mimetype,
      folder: payload?.folder,
      uploadedAt: payload?.uploadedAt,
    },
  };
};
