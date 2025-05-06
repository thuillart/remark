import type { PRODUCTS } from "@/lib/configs/products";

export type SubscriptionTier =
  | (typeof PRODUCTS)[keyof typeof PRODUCTS]
  | "free";
