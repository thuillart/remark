import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { Resend } from "resend";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
