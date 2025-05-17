import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getApiErrorMessage } from "./responseHandler";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hanldeApiError(error: unknown) {
  const message = getApiErrorMessage(error);
  console.log("Error: ", message);
  alert(message); // Using `react-hot-toast` or any UI library
}
