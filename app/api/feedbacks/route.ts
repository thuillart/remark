import { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { withAuthAndRateLimiting } from "@/lib/with-auth-and-rate-limiting";
import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import type { SubscriptionTier } from "@/lib/types";

type Context = {
  tier?: SubscriptionTier;
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

  await db.insert(feedback).values({
    from,
    text,
    referenceId: userId,
  });

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuthAndRateLimiting(secretPOST);
