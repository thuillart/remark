import type { SubscriptionTier } from "@/lib/types/subscription";

export const API_KEY_CONFIG: Record<
  SubscriptionTier,
  {
    remaining?: number;
    refillAmount?: number;
    rateLimitMax?: number;
    rateLimitEnabled: boolean;
  }
> = {
  free: {
    remaining: 250, // Monthly limit
    refillAmount: 250,
    rateLimitMax: 25, // Daily limit
    rateLimitEnabled: true,
  },
  plus: {
    remaining: undefined, // Unlimited
    refillAmount: undefined,
    rateLimitMax: undefined,
    rateLimitEnabled: false,
  },
  pro: {
    remaining: undefined, // Unlimited
    refillAmount: undefined,
    rateLimitMax: undefined,
    rateLimitEnabled: false,
  },
} as const;
