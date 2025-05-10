import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { enrichFeedback } from "@/lib/db/actions";
import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { FeedbackMetadataSchema, type SubscriptionSlug } from "@/lib/schema";
import { tryCatch } from "@/lib/utils";
import { withAuthAndRateLimiting } from "@/lib/with-auth-and-rate-limiting";

type Context = {
  slug?: SubscriptionSlug;
  apiKey: Awaited<ReturnType<typeof auth.api.verifyApiKey>>["key"];
  polarCustomerId?: string;
};

const bodySchema = z.object({
  /**
   * @description Sender email address.
   */
  from: z.string(),
  /**
   * @description The plain text version of the message.
   */
  text: z.string(),
  /**
   * @description Metadata about the feedback.
   */
  metadata: FeedbackMetadataSchema,
});

async function secretPOST(request: NextRequest, context: Context) {
  console.log("[route.ts] Received feedback request");
  const {
    apiKey: { userId },
  } = context;

  const body = await request.json();
  console.log("[route.ts] Request body:", body);
  const { from, text, metadata } = bodySchema.parse(body);
  console.log("[route.ts] Parsed body:", { from, text, metadata });

  const { error } = await tryCatch(
    db.insert(feedback).values({
      id: randomUUID(),
      from,
      text,
      metadata,
      referenceId: userId,
    }),
  );

  if (error) {
    console.log("[route.ts] Error creating feedback:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create feedback. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  console.log("[route.ts] Feedback created, starting enrichment");
  const result = await enrichFeedback({
    from,
    text,
    metadata,
  });

  console.log("[route.ts] Enrichment result:", result);

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuthAndRateLimiting(secretPOST);
