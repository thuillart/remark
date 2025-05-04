"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { apiKeyNameSchema } from "@/actions/schema";
import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { subscriptionActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils/try-catch";

const schema = z.object({
  name: apiKeyNameSchema,
  pathname: z.string(),
});

export const createApiKey = subscriptionActionClient
  .schema(schema)
  .action(
    async ({
      parsedInput: { name, pathname },
      ctx: { user, subscription },
    }) => {
      const tierConfig = API_KEY_CONFIG[subscription.plan];

      const { data: apiKey, error } = await tryCatch(
        auth.api.createApiKey({
          body: {
            name,
            prefix: "nu_",
            userId: user.id,
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
          createdAt: apiKey.createdAt,
          lastRequest: apiKey.lastRequest,
        },
      };
    },
  );
