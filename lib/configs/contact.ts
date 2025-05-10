import type { SubscriptionSlug } from "@/lib/schema";

interface ContactConfig {
  limit: number | null; // null means unlimited
}

export const CONTACT_CONFIG: Record<SubscriptionSlug, ContactConfig> = {
  free: {
    limit: 1000,
  },
  plus: {
    limit: 5000,
  },
  pro: {
    limit: null, // Unlimited
  },
} as const;
