import { ApiError } from "@/interfaces/common";
import { AxiosError } from "axios";

/**
 * Extracts message from AxiosError and returns a safe string
 */
export function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response?.status === 401) return "Session expired";

    return axiosError.response?.data?.message || "Something went wrong";
  }

  return "Something went wrong";
}
