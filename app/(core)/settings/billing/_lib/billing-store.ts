import { create } from "zustand";

import type { SubscriptionTier } from "@/lib/types";

interface BillingStore {
  plan: SubscriptionTier;
  setPlan: (plan: SubscriptionTier) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  plan: "free",
  setPlan: (plan) => set({ plan }),
}));
