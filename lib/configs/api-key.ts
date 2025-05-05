import type { SubscriptionTier } from "@/lib/types/subscription";

type ApiKeyConfig = {
  remaining: number | undefined;
  refillAmount: number | undefined;
  rateLimitMax: number | undefined;
  refillInterval: number | undefined;
  rateLimitEnabled: boolean;
  rateLimitTimeWindow: number | undefined;
};

export const API_KEY_CONFIG: Record<SubscriptionTier, ApiKeyConfig> = {
  free: {
    remaining: 250,
    refillAmount: 250,
    rateLimitMax: 250,
    refillInterval: 60 * 60 * 24 * 30, // 30 days in seconds
    rateLimitEnabled: true,
    rateLimitTimeWindow: 60 * 60 * 24 * 30, // 30 days in seconds
  },
  plus: {
    remaining: 2500,
    refillAmount: 2500,
    rateLimitMax: 2500,
    refillInterval: 60 * 60 * 24 * 30,
    rateLimitEnabled: true,
    rateLimitTimeWindow: 60 * 60 * 24 * 30,
  },
  pro: {
    remaining: undefined,
    refillAmount: undefined,
    rateLimitMax: undefined,
    refillInterval: undefined,
    rateLimitEnabled: false,
    rateLimitTimeWindow: undefined,
  },
} as const;
