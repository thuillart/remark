import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/configs/polar";
import { getSubscription } from "@/lib/db/queries";
import { SubscriptionSlug } from "@/lib/schema";
import {
  getStartOfDay,
  getStartOfMonth,
  getTimeUntilNextMonth,
  tryCatch,
} from "@/lib/utils";

type ApiKey = Awaited<ReturnType<typeof auth.api.listApiKeys>>[number];

// Make Handler type accept any type of context, exactly like Lee's example
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (request: NextRequest, context?: any) => Promise<Response>;

type SubscriptionLimits = {
  DAILY?: number;
  MONTHLY?: number;
  INCLUDED_REQUESTS?: number;
};

export const SUBSCRIPTION_LIMITS: Record<
  Uppercase<SubscriptionSlug>,
  SubscriptionLimits
> = {
  FREE: {
    MONTHLY: 250,
    INCLUDED_REQUESTS: 250,
  },
  PLUS: {
    MONTHLY: 2500,
    INCLUDED_REQUESTS: 2500,
  },
  PRO: {
    MONTHLY: 7500,
    INCLUDED_REQUESTS: 7500,
  },
} as const;

export function withAuthAndRateLimiting(handler: Handler): Handler {
  return async (request, context) => {
    // Authentication step
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { key, error } = await auth.api.verifyApiKey({
      body: {
        key: apiKey,
      },
    });

    if (error) {
      let message = error.message;
      let status = 403;

      switch (error.code) {
        case "KEY_NOT_FOUND":
          message = "API key not found. Please check your key and try again.";
          break;
        case "KEY_DISABLED":
          message = "This API key has been disabled. Please contact support.";
          break;
        case "KEY_EXPIRED":
          message = "This API key has expired. Please generate a new key.";
          break;
        case "USAGE_EXCEEDED":
          message =
            "Monthly usage limit exceeded. Wait for next month or upgrade for more requests.";
          break;
        case "RATE_LIMITED": {
          message =
            "You've reached your daily limit. Try again tomorrow or upgrade to get rid of it.";
          status = 429;
          break;
        }
      }

      return new Response(
        JSON.stringify({ code: error.code, error: message }),
        {
          status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!key) {
      return new Response(
        JSON.stringify({
          error:
            "We're unable to process your request right now, please try again later.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Rate limiting step
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

    if (!result?.data || !result.data.subscription?.polarCustomerId) {
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

    const slug: SubscriptionSlug = result.data.subscription.slug;
    const polarCustomerId = result.data.subscription.polarCustomerId;

    // Count requests made this month, to know if they've exceeded monthly limit.
    const requestsMadeThisMonth = countRequestsInPeriod(
      apiKeys,
      getStartOfMonth(),
    );

    // 4. Otherwise, they're free tier.
    if (slug === "free") {
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

    if (slug === "plus") {
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

    if (slug === "pro") {
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
      apiKey: key,
      slug,
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
