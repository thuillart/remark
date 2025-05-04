import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

import { getSubscription } from "@/actions/get-subscription";
import { auth } from "@/lib/auth";
import { stripeClient } from "@/lib/configs/stripe";
import { tryCatch } from "@/lib/utils";

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

const RATE_LIMITS = {
  FREE: {
    DAILY: 25,
    MONTHLY: 250,
  },
  PLUS: {
    INCLUDED_REQUESTS: 2500,
  },
};

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
    const result = await getSubscription();

    if (!result?.data || !result.data.subscription.stripeCustomerId) {
      throw new ZodRouteError(
        "Internal server error. We're unable to process your request right now, please try again later.",
        500,
      );
    }

    const tier = result.data.subscription.tier;
    const stripeCustomerId = result.data.subscription.stripeCustomerId;

    // Count requests made this month, to know if they've exceeded monthly limit.
    const requestsMadeThisMonth = countRequestsInPeriod(
      apiKeys,
      getStartOfMonth(),
    );

    // 4. Otherwise, they're free tier.
    if (tier === "free") {
      // Count requests made today, to know if they've exceeded daily limit.
      const requestsMadeToday = countRequestsInPeriod(apiKeys, getStartOfDay());

      if (requestsMadeToday >= RATE_LIMITS.FREE.DAILY) {
        throw new ZodRouteError(
          `Daily request limit of (${RATE_LIMITS.FREE.DAILY}) reached. Try again tomorrow or upgrade for more requests.`,
          429,
        );
      }

      if (requestsMadeThisMonth >= RATE_LIMITS.FREE.MONTHLY) {
        throw new ZodRouteError(
          `Monthly request limit of (${RATE_LIMITS.FREE.MONTHLY}) reached. Try again next month or upgrade for more requests.`,
          429,
        );
      }
    }

    if (tier === "plus") {
      // If they've exceeded the included requests, update stripe for metered billing.
      if (requestsMadeThisMonth >= RATE_LIMITS.PLUS.INCLUDED_REQUESTS) {
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
        tier,
        stripeCustomerId,
      },
    });
  },
);

function getStartOfDay(): Date {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function countRequestsInPeriod(
  apiKeys: Awaited<ReturnType<typeof auth.api.listApiKeys>>,
  startDate: Date,
): number {
  // Iterate over all API keys and makes the sum of all the request counts.
  return apiKeys.reduce((totalRequests, apiKey) => {
    const hasRecentRequest =
      apiKey.lastRequest && new Date(apiKey.lastRequest) >= startDate;
    const requestCount = apiKey.requestCount || 0;

    return hasRecentRequest ? totalRequests + requestCount : totalRequests;
  }, 0);
}
