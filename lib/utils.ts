import { type ToastProps, showToast } from "@/components/ui/sonner";
import { type ClassValue, clsx } from "clsx";
import {
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function toast(toast: Omit<ToastProps, "id">) {
  return showToast(toast);
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function getStartOfDay(): Date {
  return startOfDay(new Date());
}

export function getStartOfMonth(): Date {
  return startOfMonth(new Date());
}

export function getTimeUntilNextMonth(): string {
  const now = new Date();
  const nextMonth = startOfMonth(addMonths(now, 1));
  const days = differenceInDays(nextMonth, now);
  const hours = differenceInHours(nextMonth, now) % 24;
  const minutes = differenceInMinutes(nextMonth, now) % 60;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function tryCatch<T>(
  promise: Promise<T>,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
