"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { actionClient } from "@/lib/safe-action";
import { subscriptionTierSchema } from "@/lib/schemas/subscription";
import { tryCatch } from "@/lib/utils";

const schema = z.object({
  plan: subscriptionTierSchema,
});

export const updateApiKeysLimits = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { plan } }) => {
    // 1. Get all API keys
    const { data: apiKeys, error } = await tryCatch(
      auth.api.listApiKeys({
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: "Failed getting your API keys" };
    }

    const config = API_KEY_CONFIG[plan];

    // For each key, check if metadata.tier matches the new plan
    for (const key of apiKeys) {
      if (key.metadata?.tier === plan) continue; // Already up to date

      // Update the key
      await auth.api.updateApiKey({
        body: {
          keyId: key.id,
          userId: key.userId,
          metadata: { tier: plan },
          remaining: config.remaining,
          refillAmount: config.refillAmount,
          rateLimitMax: config.rateLimitMax,
          refillInterval: config.refillInterval,
          rateLimitEnabled: config.rateLimitEnabled,
          rateLimitTimeWindow: config.rateLimitTimeWindow,
        },
      });
    }

    return { data: true };
  });
