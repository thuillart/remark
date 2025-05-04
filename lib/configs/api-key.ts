import type { auth } from "@/lib/auth";
import type { SubscriptionTier } from "@/lib/types/subscription";

type ApiKeyConfig = Pick<
  Parameters<typeof auth.api.createApiKey>[0]["body"],
  | "remaining"
  | "rateLimitMax"
  | "refillAmount"
  | "refillInterval"
  | "rateLimitEnabled"
  | "rateLimitTimeWindow"
>;

export const API_KEY_CONFIG: Record<SubscriptionTier, ApiKeyConfig> = {
  free: {
    remaining: 250, // 250 requests per month
    refillAmount: 250, // Refill 250 monthly
    rateLimitMax: 25, // 25 requests per day
    refillInterval: 60 * 60 * 24 * 30, // 30 days in seconds
    rateLimitEnabled: true, // Rate limited daily
    rateLimitTimeWindow: 60 * 60 * 24, // 24 hours in seconds
  },
  plus: {
    remaining: 2500, // 2500 requests per month (10x free)
    refillAmount: 2500, // Refill 2500 monthly
    rateLimitMax: undefined, // No daily limit
    refillInterval: 60 * 60 * 24 * 30, // 30 days in seconds
    rateLimitEnabled: true, // Still rate limited monthly
    rateLimitTimeWindow: 60 * 60 * 24, // 24 hours in seconds
  },
  /**
   * This plan has no limits as we're using metered billing.
   * We calculate the limits based on the number of requests made.
   */
  pro: {
    remaining: undefined, // Unlimited monthly
    refillAmount: undefined,
    rateLimitMax: undefined, // No daily limit
    refillInterval: undefined,
    rateLimitEnabled: false, // No rate limiting
    rateLimitTimeWindow: undefined,
  },
} as const;
