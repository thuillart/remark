import type { auth } from "@/lib/auth";
import type { SubscriptionSlug } from "@/lib/schema";

type ApiKeyConfig = Pick<
  Parameters<typeof auth.api.createApiKey>[0]["body"],
  | "remaining"
  | "rateLimitMax"
  | "refillAmount"
  | "refillInterval"
  | "rateLimitEnabled"
  | "rateLimitTimeWindow"
>;
export const API_KEY_CONFIG: Record<SubscriptionSlug, ApiKeyConfig> = {
  /**
   * 250 requests each month, 25 requests per day
   */
  free: {
    remaining: 250, // Initial remaining requests
    refillAmount: 250,
    refillInterval: 60 * 60 * 24 * 30, // Refill 250 requests every month
    rateLimitEnabled: true,
    rateLimitTimeWindow: 1000 * 60 * 60 * 24, // 1 day
    rateLimitMax: 25, // Max requests per day
  },
  /**
   * 2500 requests each month, no daily limit
   */
  plus: {
    remaining: 2500,
    refillAmount: 2500,
    refillInterval: 60 * 60 * 24 * 30,
  },
  /**
   * Unlimited requests (metered by middleware)
   */
  pro: {},
} as const;
