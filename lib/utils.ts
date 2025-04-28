import { type ToastProps, showToast } from "@/components/ui/sonner";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function toast(toast: Omit<ToastProps, "id">) {
  return showToast(toast);
}
