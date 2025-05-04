"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { apiKeyNameSchema } from "@/actions/schema";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/helpers/try-catch";
import { subscriptionActionClient } from "@/lib/safe-action";

const schema = z.object({
  name: apiKeyNameSchema,
  pathname: z.string(),
});

const apiKeyConfig = {
  free: {
    remaining: 250, // Monthly limit of 250 requests
    refillAmount: 250, // Refill 250 requests every month
    rateLimitMax: 25, // Max 25 requests per day
    rateLimitEnabled: true,
  },
  plus: {
    remaining: undefined, // Unlimited requests (no cap)
    refillAmount: undefined, // No refill needed since it's unlimited
    rateLimitMax: undefined, // No daily rate limit
    rateLimitEnabled: false,
  },
  pro: {
    remaining: undefined, // Unlimited requests (no cap)
    refillAmount: undefined, // No refill needed since it's unlimited
    rateLimitMax: undefined, // No daily rate limit
    rateLimitEnabled: false,
  },
};

export const createApiKey = subscriptionActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { name, pathname },
      ctx: { user, subscription },
    }) => {
      const tierConfig =
        subscription.tier === "plus" ? apiKeyConfig.plus : apiKeyConfig.free;

      const { data: apiKey, error } = await tryCatch(
        auth.api.createApiKey({
          body: {
            name,
            prefix: "re_",
            userId: user.id,
            remaining: tierConfig.remaining,
            refillAmount: tierConfig.refillAmount,
            refillInterval: tierConfig.remaining
              ? 60 * 60 * 24 * 30
              : undefined, // 30 days (in seconds) for free tier, undefined for plus
            rateLimitMax: tierConfig.rateLimitMax,
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
          createdAt: apiKey.createdAt,
          lastRequest: apiKey.lastRequest,
        },
      };
    },
  );
