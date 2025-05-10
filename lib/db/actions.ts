"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { actionClient, subscriptionActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils";
import { APP_NAME, ADMIN_ID } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { authActionClient } from "@/lib/safe-action";

export const createFeedback = authActionClient
  .schema(
    z.object({
      text: z.string(),
    }),
  )
  .action(async ({ parsedInput: { text }, ctx: { user } }) => {
    const { error } = await tryCatch(
      db.insert(feedback).values({
        from: user.email,
        text,
        referenceId: ADMIN_ID,
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    return { success: true };
  });

export const createApiKey = subscriptionActionClient
  .schema(
    z.object({
      name: z.string().min(1).max(50).trim(),
      pathname: z.string(),
    }),
  )
  .action(
    async ({
      parsedInput: { name, pathname },
      ctx: { user, subscription },
    }) => {
      const tierConfig = API_KEY_CONFIG[subscription.tier];

      const { data: apiKey, error } = await tryCatch(
        auth.api.createApiKey({
          body: {
            name,
            prefix: APP_NAME.toLowerCase().slice(0, 2) + "_",
            userId: user.id,
            metadata: { tier: subscription.tier },
            remaining: tierConfig.remaining,
            refillAmount: tierConfig.refillAmount,
            rateLimitMax: tierConfig.rateLimitMax,
            refillInterval: tierConfig.refillInterval,
            rateLimitEnabled: tierConfig.rateLimitEnabled,
            rateLimitTimeWindow: 60 * 60 * 24, // 24 hours (in seconds)
          },
          headers: await headers(),
        }),
      );

      if (!apiKey || error) {
        return { failure: "We couldn't create your API key" };
      }

      revalidatePath(pathname);

      return {
        apiKey: {
          id: apiKey.id,
          key: apiKey.key,
          name: apiKey.name,
          start: apiKey.start,
          createdAt: new Date(apiKey.createdAt),
          lastRequest: apiKey.lastRequest ? new Date(apiKey.lastRequest) : null,
        },
      };
    },
  );

export const deleteApiKey = authActionClient
  .schema(
    z.object({
      keyId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { keyId } }) => {
    const { data: apiKey, error } = await tryCatch(
      auth.api.deleteApiKey({
        body: {
          keyId,
        },
        headers: await headers(),
      }),
    );

    if (!apiKey || error) {
      return { failure: "We couldn't delete your API key" };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });

export const updateApiKey = authActionClient
  .schema(
    z.object({
      keyId: z.string(),
      newName: z.string().min(1).max(50).trim(),
    }),
  )
  .action(async ({ parsedInput: { keyId, newName } }) => {
    const { data: apiKey, error } = await tryCatch(
      auth.api.updateApiKey({
        body: {
          keyId,
          name: newName,
        },
        headers: await headers(),
      }),
    );

    if (!apiKey || error) {
      return { failure: "We couldn't update your API key" };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });

export const updateApiKeysLimits = actionClient
  .schema(
    z.object({
      plan: z.enum(["free", "plus", "pro"]),
    }),
  )
  .action(async ({ parsedInput: { plan } }) => {
    // 1. Get all API keys
    const { data: apiKeys, error } = await tryCatch(
      auth.api.listApiKeys({
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    const config = API_KEY_CONFIG[plan];

    // For each key, check if metadata.tier matches the new plan
    for (const key of apiKeys) {
      if (key.metadata?.tier === plan) continue; // No need to update

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

    return { success: true };
  });
