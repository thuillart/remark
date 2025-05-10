import { NextRequest } from "next/server";

import { getSubscription } from "@/actions/get-subscription";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/configs/polar";
import { SUBSCRIPTION_LIMITS } from "@/lib/constants";
import type { SubscriptionTier } from "@/lib/types";
import { tryCatch } from "@/lib/utils";
import {
  getStartOfDay,
  getStartOfMonth,
  getTimeUntilNextMonth,
} from "@/lib/utils/date";

type ApiKey = Awaited<ReturnType<typeof auth.api.listApiKeys>>[number];
type Handler = (
  request: NextRequest,
  context?: { apiKey: any; tier?: SubscriptionTier; polarCustomerId?: string },
) => Promise<Response>;

export function withRateLimiting(handler: Handler): Handler {
  return async (request, context) => {
    if (!context?.apiKey) {
      return new Response(
        JSON.stringify({
          error: "Authentication required before rate limiting can be applied",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 1. Get all user's API keys.
    const { data: apiKeys, error: apiKeysError } = await tryCatch(
      auth.api.listApiKeys({ headers: request.headers }),
    );

    if (apiKeysError) {
      return new Response(
        JSON.stringify({
          error:
            "Internal server error. We're unable to process your request right now, please try again later.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!apiKeys || !Array.isArray(apiKeys) || apiKeys.length === 0) {
      return new Response(
        JSON.stringify({ error: "You don't have any API keys." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 2. Get user's subscription.
    const result = await getSubscription({});

    if (!result?.data || !result.data.subscription[0]?.polarCustomerId) {
      return new Response(
        JSON.stringify({
          error:
            "Internal server error. We're unable to process your request right now, please try again later.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const tier: SubscriptionTier = result.data.subscription[0].tier;
    const polarCustomerId = result.data.subscription[0].polarCustomerId;

    // Count requests made this month, to know if they've exceeded monthly limit.
    const requestsMadeThisMonth = countRequestsInPeriod(
      apiKeys,
      getStartOfMonth(),
    );

    // 4. Otherwise, they're free tier.
    if (tier === "free") {
      // Count requests made today, to know if they've exceeded daily limit.
      const requestsMadeToday = countRequestsInPeriod(apiKeys, getStartOfDay());

      if (requestsMadeToday >= SUBSCRIPTION_LIMITS.FREE.DAILY) {
        return new Response(
          JSON.stringify({
            error: `Daily request limit of (${SUBSCRIPTION_LIMITS.FREE.DAILY}) reached. Try again tomorrow or upgrade for more requests.`,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (requestsMadeThisMonth >= SUBSCRIPTION_LIMITS.FREE.MONTHLY) {
        return new Response(
          JSON.stringify({
            error: `Monthly request limit of (${SUBSCRIPTION_LIMITS.FREE.MONTHLY}) reached. Try again in ${getTimeUntilNextMonth()} or upgrade for more requests.`,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    if (tier === "plus") {
      if (requestsMadeThisMonth >= SUBSCRIPTION_LIMITS.PLUS.INCLUDED_REQUESTS) {
        return new Response(
          JSON.stringify({
            error: `Monthly request limit of (${SUBSCRIPTION_LIMITS.PLUS.INCLUDED_REQUESTS}) reached. Try again in ${getTimeUntilNextMonth()} or upgrade for more requests.`,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    if (tier === "pro") {
      if (requestsMadeThisMonth >= SUBSCRIPTION_LIMITS.PRO.INCLUDED_REQUESTS) {
        const { error } = await tryCatch(
          polarClient.events.ingest({
            events: [
              {
                name: "api-requests",
                externalCustomerId: polarCustomerId,
              },
            ],
          }),
        );

        if (error) {
          return new Response(
            JSON.stringify({
              error:
                "Internal server error. We're unable to process your request right now, please try again later.",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    }

    return handler(request, {
      ...context,
      tier,
      polarCustomerId,
    });
  };
}

// Counts total API requests for metered billing (Pro plan only)
function countRequestsInPeriod(apiKeys: ApiKey[], startDate: Date): number {
  return apiKeys.reduce((totalRequests, key) => {
    // Skip keys that have never been used
    if (!key.lastRequest) {
      return totalRequests;
    }

    const lastRequestDate = new Date(key.lastRequest);

    // Skip keys that haven't been used in this period
    if (lastRequestDate < startDate) {
      return totalRequests;
    }

    // Add the request count for keys used in the period
    return totalRequests + (key.requestCount ?? 0);
  }, 0);
}
