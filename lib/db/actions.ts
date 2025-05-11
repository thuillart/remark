"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { getFeedbackPrompt } from "@/lib/configs/feedback";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { contact, feedback } from "@/lib/db/schema";
import {
  actionClient,
  authActionClient,
  subscriptionActionClient,
} from "@/lib/safe-action";
import {
  feedbackEnrichmentSchema,
  feedbackMetadataSchema,
  SubscriptionSlugSchema,
} from "@/lib/schema";
import { tryCatch } from "@/lib/utils";

export const createFeedback = authActionClient
  .schema(
    z.object({
      text: z.string(),
      metadata: feedbackMetadataSchema,
    }),
  )
  .action(async ({ parsedInput: { text, metadata }, ctx: { user } }) => {
    // 1. Enrich the feedback
    const result = await enrichFeedback({
      from: user.email,
      text,
      metadata,
    });

    if (!result.data) {
      return { failure: "Something went wrong" };
    }

    const { error } = await tryCatch(
      db.insert(feedback).values({
        id: randomUUID(),
        from: user.email,
        text,
        tags: result.data.enrichment.tags,
        impact: result.data.enrichment.impact,
        subject: result.data.enrichment.subject,
        summary: result.data.enrichment.summary,
        metadata,
        referenceId: process.env.ADMIN_ID,
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    return { success: true };
  });

export const enrichFeedback = actionClient
  .schema(
    z.object({
      from: z.string().email(),
      text: z.string(),
      metadata: feedbackMetadataSchema,
    }),
  )
  .action(async ({ parsedInput: { from, text, metadata } }) => {
    // 1. Lookup for a contact with the same email
    const existingContact = await db.query.contact.findFirst({
      where: eq(contact.email, from),
    });

    // 2. Generate classification
    const { text: output } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt: getFeedbackPrompt({
        from,
        text,
        name: existingContact?.name,
        metadata,
      }),
    });

    // 3. Extract information from the output
    const parsedOutput = z.string().parse(output);
    const enrichment = feedbackEnrichmentSchema.parse(JSON.parse(parsedOutput));

    return { enrichment };
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
