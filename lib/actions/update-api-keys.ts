import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import type { SubscriptionTier } from "@/lib/types/subscription";
import { tryCatch } from "@/lib/utils/try-catch";
import type { Subscription } from "@better-auth/stripe";

export async function updateAllApiKeyLimits(subscription: Subscription) {
  const { data: apiKeys, error } = await tryCatch(
    auth.api.listApiKeys({ headers: await headers() }),
  );

  if (error) {
    console.error("Failed to list API keys:", error);
    return;
  }

  const config = API_KEY_CONFIG[subscription.plan as SubscriptionTier];

  // For each key, check if metadata.tier matches the new plan
  for (const key of apiKeys) {
    if (key.metadata?.tier === subscription.plan) continue; // Already up to date

    // Update the key
    await auth.api.updateApiKey({
      body: {
        keyId: key.id,
        userId: key.userId,
        metadata: { tier: subscription.plan },
        remaining: config.remaining,
        refillAmount: config.refillAmount,
        rateLimitMax: config.rateLimitMax,
        refillInterval: config.refillInterval,
        rateLimitEnabled: config.rateLimitEnabled,
        rateLimitTimeWindow: config.rateLimitTimeWindow,
      },
    });
  }
}
