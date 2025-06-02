import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getApiErrorMessage } from "./responseHandler";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleApiError(error: unknown) {
  const message = getApiErrorMessage(error);
  console.log("Error: ", message);
  toast("Error", {
    description: message,
  });
}
