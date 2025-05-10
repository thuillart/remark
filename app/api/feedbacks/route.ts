import { NextRequest } from "next/server";
import { object, z } from "zod";
import { randomUUID } from "crypto";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { withAuthAndRateLimiting } from "@/lib/with-auth-and-rate-limiting";
import { db } from "@/lib/db/drizzle";
import { contact, feedback } from "@/lib/db/schema";
import type { SubscriptionSlug } from "@/lib/schema";
import { tryCatch } from "@/lib/utils";

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
});

async function secretPOST(request: NextRequest, context: Context) {
  const {
    apiKey: { userId },
  } = context;

  const body = await request.json();
  const { from, text } = bodySchema.parse(body);

  const { error } = await tryCatch(
    db.insert(feedback).values({
      id: randomUUID(),
      from,
      text,
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

  // 1. We search for a contact with the same email
  const existingContact = await db.query.contact.findFirst({
    where: eq(contact.email, from),
  });

  let enrichedFeedback: {
    from: string;
    text: string;
    referenceId?: string;
    firstName?: string;
    lastName?: string;
    metadata?: string[];
  };

  if (existingContact) {
    enrichedFeedback = {
      ...existingContact,
      lastName: existingContact.lastName,
      metadata: existingContact.metadata,
      firstName: existingContact.firstName,
    };
  } else {
    enrichedFeedback = {
      from,
      text,
    };
  }

  if (context.slug !== "free") {
    const { text: response } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt: `You are a helpful assistant that summarizes feedback.
      
      Feedback: ${text}
      
      Summary:`,
    });
  }

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuthAndRateLimiting(secretPOST);
