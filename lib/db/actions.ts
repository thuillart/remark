"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { actionClient, subscriptionActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { SubscriptionSlugSchema } from "@/lib/schema";

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
      const slugConfig = API_KEY_CONFIG[subscription.slug];

      const { data: apiKey, error } = await tryCatch(
        auth.api.createApiKey({
          body: {
            name,
            prefix: APP_NAME.toLowerCase().slice(0, 2) + "_",
            userId: user.id,
            metadata: { slug: subscription.slug },
            remaining: slugConfig.remaining,
            refillAmount: slugConfig.refillAmount,
            rateLimitMax: slugConfig.rateLimitMax,
            refillInterval: slugConfig.refillInterval,
            rateLimitEnabled: slugConfig.rateLimitEnabled,
            rateLimitTimeWindow: slugConfig.rateLimitTimeWindow,
          },
          headers: await headers(),
        }),
      );

      if (error) {
        return { failure: error.message };
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
    const { error } = await tryCatch(
      auth.api.deleteApiKey({
        body: { keyId },
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
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
    const { error } = await tryCatch(
      auth.api.updateApiKey({
        body: {
          keyId,
          name: newName,
        },
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });

export const updateApiKeysLimits = actionClient
  .schema(
    z.object({
      newSlug: SubscriptionSlugSchema,
    }),
  )
  .action(async ({ parsedInput: { newSlug } }) => {
    const { data: apiKeys, error } = await tryCatch(
      auth.api.listApiKeys({
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    const slugConfig = API_KEY_CONFIG[newSlug];

    // For each key, check if metadata.tier matches the new plan
    for (const key of apiKeys) {
      if (key.metadata?.slug === newSlug) continue; // If the key is already up-to-date, skip

      await auth.api.updateApiKey({
        body: {
          keyId: key.id,
          userId: key.userId,
          metadata: { slug: newSlug },
          remaining: slugConfig.remaining,
          refillAmount: slugConfig.refillAmount,
          rateLimitMax: slugConfig.rateLimitMax,
          refillInterval: slugConfig.refillInterval,
          rateLimitEnabled: slugConfig.rateLimitEnabled,
          rateLimitTimeWindow: slugConfig.rateLimitTimeWindow,
        },
      });
    }

    return { success: true };
  });
