type SubscriptionLimits = {
  DAILY?: number;
  MONTHLY?: number;
  INCLUDED_REQUESTS?: number;
};

type UppercaseSubscriptionTier = "FREE" | "PLUS" | "PRO";

export const SUBSCRIPTION_LIMITS: Record<
  UppercaseSubscriptionTier,
  SubscriptionLimits
> = {
  FREE: {
    DAILY: 25,
    MONTHLY: 250,
    INCLUDED_REQUESTS: 2500,
  },
  PLUS: {
    INCLUDED_REQUESTS: 2500,
  },
  PRO: {
    INCLUDED_REQUESTS: 7500,
  },
} as const;
