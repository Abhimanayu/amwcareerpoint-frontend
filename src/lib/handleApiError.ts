// Error handling utility
import { AxiosError } from "axios";

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: { field: string; message: string }[];
  };
}

export const handleApiError = (err: unknown): string => {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as ApiErrorResponse;
    if (data.error) {
      return data.error.message || "Something went wrong";
    }
  }
  if (err instanceof AxiosError && err.request) {
    return "Network error. Check your connection.";
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred";
};
