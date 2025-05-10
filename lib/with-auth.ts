import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

type ApiKey = Awaited<ReturnType<typeof auth.api.verifyApiKey>>["key"];

type Handler = (
  request: NextRequest,
  context?: { apiKey: ApiKey },
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (request, context) => {
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
            "Monthly usage limit exceeded. Please upgrade your plan for more requests.";
          break;
        case "RATE_LIMITED": {
          const retryAfterInSeconds = error.details?.tryAgainIn || 60;
          message = `Rate limit exceeded. Please try again in ${retryAfterInSeconds} seconds.`;
          status = 429;
          break;
        }
      }

      return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
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
    return handler(request, {
      ...context,
      apiKey: key,
    });
  };
}
