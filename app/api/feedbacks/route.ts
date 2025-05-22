import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { z } from "zod";

import { enrichFeedback } from "@/lib/db/actions";
import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { feedbackMetadataSchema } from "@/lib/schema";
import { tryCatch } from "@/lib/utils";
import { withAuthAndRateLimiting } from "@/lib/with-auth-and-rate-limiting";

// Accept any context to match middleware pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Context = any;

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
  metadata: feedbackMetadataSchema,
});

async function secretPOST(request: NextRequest, context: Context) {
  console.log("we've been hit and successfully passed the middleware");
  const userId = context?.apiKey?.userId;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { from, text, metadata } = bodySchema.parse(body);

  // First enrich the feedback
  const result = await enrichFeedback({
    from,
    text,
    metadata,
  });

  if (!result.data) {
    return new Response(
      JSON.stringify({
        error: "Failed to process feedback. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Then create the feedback with enrichment data
  const { error } = await tryCatch(
    db.insert(feedback).values({
      id: randomUUID(),
      from,
      text,
      tags: result.data.enrichment.tags,
      impact: result.data.enrichment.impact,
      subject: result.data.enrichment.subject,
      summary: result.data.enrichment.summary,
      metadata,
      referenceId: userId,
    }),
  );

  if (error) {
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

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuthAndRateLimiting(secretPOST);
