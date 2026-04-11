import { adminApi } from "./api";

// POST /media/upload
export const uploadImage = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await adminApi.post("/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
