import { type ToastProps, showToast } from "@/components/ui/sonner";

export async function toast(toast: Omit<ToastProps, "id">) {
  return showToast(toast);
}
