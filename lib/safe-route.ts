import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

import { getSubscription } from "@/actions/get-subscription";
import { auth } from "@/lib/auth";
import { stripeClient } from "@/lib/configs/stripe";
import { SUBSCRIPTION_LIMITS } from "@/lib/constants";
import { tryCatch } from "@/lib/utils";
import {
  getStartOfDay,
  getStartOfMonth,
  getTimeUntilNextMonth,
} from "@/lib/utils/date";

export class ZodRouteError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export const route = createZodRoute({
  handleServerError: (error: Error) => {
    if (error instanceof ZodRouteError) {
      return NextResponse.json(
        { error: error.message, status: error.status },
        { status: error.status },
      );
    }

    return NextResponse.json({ message: error.message }, { status: 500 });
  },
});

const loggingMiddleware = route.use(async ({ next }) => {
  console.log("Before handler");
  const startTime = performance.now();

  const response = await next();

  const endTime = performance.now() - startTime;
  console.log(`After handler - took ${Math.round(endTime)}ms`);

  return response;
});

export const authRoute = loggingMiddleware.use(async ({ next, request }) => {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    throw new ZodRouteError(
      "Missing API key. Please provide it in the constructor.",
      401,
    );
  }

  const { key, error } = await auth.api.verifyApiKey({
    body: { key: apiKey },
  });

  if (error) {
    let errorMessage = error.message;
    let statusCode = 403;

    switch (error.code) {
      case "KEY_NOT_FOUND":
        errorMessage =
          "API key not found. Please check your key and try again.";
        break;
      case "KEY_DISABLED":
        errorMessage =
          "This API key has been disabled. Please contact support.";
        break;
      case "KEY_EXPIRED":
        errorMessage = "This API key has expired. Please generate a new key.";
        break;
      case "USAGE_EXCEEDED":
        errorMessage =
          "Monthly usage limit exceeded. Please upgrade your plan for more requests.";
        break;
      case "RATE_LIMITED": {
        const retryAfterInSeconds = error.details?.tryAgainIn || 60;
        errorMessage = `Rate limit exceeded. Please try again in ${retryAfterInSeconds} seconds.`;
        statusCode = 429;
        break;
      }
    }

    throw new ZodRouteError(errorMessage, statusCode);
  }

  if (!key) {
    throw new ZodRouteError(
      "Internal server error. We're unable to process your request right now, please try again later.",
      500,
    );
  }

  return next({ ctx: { apiKey: key } });
});

export const rateLimitedRoute = authRoute.use(
  async ({ ctx, next, request }) => {
    // 1. Get all user's API keys.
    const { data: apiKeys, error: apiKeysError } = await tryCatch(
      auth.api.listApiKeys({ headers: request.headers }),
    );

    if (apiKeysError) {
      throw new ZodRouteError(
        "Internal server error. We're unable to process your request right now, please try again later.",
        500,
      );
    }

    if (!apiKeys || !Array.isArray(apiKeys) || apiKeys.length === 0) {
      throw new ZodRouteError("You don't have any API keys.", 403);
    }

    // 2. Get user's subscription.
    const result = await getSubscription({});

    if (!result?.data || !result.data.subscription[0]?.stripeCustomerId) {
      throw new ZodRouteError(
        "Internal server error. We're unable to process your request right now, please try again later.",
        500,
      );
    }

    const plan = result.data.subscription[0].plan;
    const stripeCustomerId = result.data.subscription[0].stripeCustomerId;

    // Count requests made this month, to know if they've exceeded monthly limit.
    const requestsMadeThisMonth = countRequestsInPeriod(
      apiKeys,
      getStartOfMonth(),
    );

    // 4. Otherwise, they're free tier.
    if (plan === "free") {
      // Count requests made today, to know if they've exceeded daily limit.
      const requestsMadeToday = countRequestsInPeriod(apiKeys, getStartOfDay());

      if (requestsMadeToday >= SUBSCRIPTION_LIMITS.FREE.DAILY) {
        throw new ZodRouteError(
          `Daily request limit of (${SUBSCRIPTION_LIMITS.FREE.DAILY}) reached. Try again tomorrow or upgrade for more requests.`,
          429,
        );
      }

      if (requestsMadeThisMonth >= SUBSCRIPTION_LIMITS.FREE.MONTHLY) {
        throw new ZodRouteError(
          `Monthly request limit of (${SUBSCRIPTION_LIMITS.FREE.MONTHLY}) reached. Try again in ${getTimeUntilNextMonth()} or upgrade for more requests.`,
          429,
        );
      }
    }

    if (plan === "plus") {
      if (requestsMadeThisMonth >= SUBSCRIPTION_LIMITS.PLUS.INCLUDED_REQUESTS) {
        throw new ZodRouteError(
          `Monthly request limit of (${SUBSCRIPTION_LIMITS.PLUS.INCLUDED_REQUESTS}) reached. Try again in ${getTimeUntilNextMonth()} or upgrade for more requests.`,
          429,
        );
      }
    }

    if (plan === "pro") {
      if (requestsMadeThisMonth >= SUBSCRIPTION_LIMITS.PRO.INCLUDED_REQUESTS) {
        const { error } = await tryCatch(
          stripeClient.billing.meterEvents.create({
            event_name: "api_requests",
            payload: {
              value: "1",
              stripe_customer_id: stripeCustomerId,
            },
          }),
        );

        if (error) {
          throw new ZodRouteError(
            "Internal server error. We're unable to process your request right now, please try again later.",
            500,
          );
        }
      }
    }

    return next({
      ctx: {
        ...ctx,
        plan,
        stripeCustomerId,
      },
    });
  },
);

type ApiKey = Awaited<ReturnType<typeof auth.api.listApiKeys>>[number];

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
