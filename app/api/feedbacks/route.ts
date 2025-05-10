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
  const {
    apiKey: { userId },
  } = context;

  const body = await request.json();
  const { from, text, metadata } = bodySchema.parse(body);

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
    console.log("seems there's an error with the feedback creation", error);
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

  const result = await enrichFeedback({
    from,
    text,
    metadata,
  });

  console.log("raw result", result);
  console.log("pretty result", JSON.stringify(result, null, 2));

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuthAndRateLimiting(secretPOST);
