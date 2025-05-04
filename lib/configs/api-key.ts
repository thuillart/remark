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
    remaining: 250,
    refillAmount: 250,
    rateLimitMax: 250,
    refillInterval: 1000 * 60 * 60 * 24 * 30, // 30 days
    rateLimitEnabled: true,
    rateLimitTimeWindow: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  plus: {
    remaining: 2500, // 10x free count
    refillAmount: 2500,
    rateLimitMax: 2500,
    refillInterval: 1000 * 60 * 60 * 24 * 30, // 30 days
    rateLimitEnabled: true,
    rateLimitTimeWindow: 1000 * 60 * 60 * 24 * 30, // 30 days
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
