import type { SubscriptionTier } from "@/lib/types/subscription";

type SubscriptionLimits = {
  DAILY?: number;
  MONTHLY?: number;
  INCLUDED_REQUESTS?: number;
};

export const SUBSCRIPTION_LIMITS: Record<
  Uppercase<SubscriptionTier>,
  SubscriptionLimits
> = {
  FREE: {
    MONTHLY: 250,
    INCLUDED_REQUESTS: 250,
  },
  PLUS: {
    MONTHLY: 2500,
    INCLUDED_REQUESTS: 2500,
  },
  PRO: {
    MONTHLY: 7500,
    INCLUDED_REQUESTS: 7500,
  },
} as const;
