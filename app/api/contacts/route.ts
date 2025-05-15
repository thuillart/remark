import { randomUUID } from "crypto";
import { count, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { CONTACT_CONFIG } from "@/lib/configs/contact";
import { db } from "@/lib/db/drizzle";
import { getSubscription } from "@/lib/db/queries";
import { contact } from "@/lib/db/schema";
import { contactMetadataSchema } from "@/lib/schema";
import { withAuth } from "@/lib/with-auth";

type Context = {
  apiKey: Awaited<ReturnType<typeof auth.api.verifyApiKey>>["key"];
};

const bodySchema = z.object({
  /**
   * @description The email address of the contact.
   * @required
   */
  email: z.string().email(),
  /**
   * @description The name of the contact.
   * @optional
   */
  name: z.string().optional(),
  /**
   * @description Any additional metadata about the contact.
   * @optional
   */
  metadata: contactMetadataSchema,
});

async function secretPOST(request: NextRequest, context: Context) {
  const {
    apiKey: { userId },
  } = context;

  const body = await request.json();
  const { name, email, metadata } = bodySchema.parse(body);

  // Get user's subscription to check contact limits
  const result = await getSubscription({});
  if (!result?.data?.subscription?.slug) {
    return new Response(
      JSON.stringify({
        error: "Unable to determine subscription type. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const slug = result.data.subscription.slug;
  const contactLimit = CONTACT_CONFIG[slug].limit;

  // Check if user has exceeded their contact limit
  if (contactLimit !== null) {
    const [{ count: contactCount }] = await db
      .select({ count: count() })
      .from(contact)
      .where(eq(contact.referenceId, userId));

    if (contactCount >= contactLimit) {
      return new Response(
        JSON.stringify({
          error: `Contact limit of ${contactLimit} reached. Please upgrade your plan for more contacts.`,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  const [existingContact] = await db
    .select()
    .from(contact)
    .where(eq(contact.referenceId, userId) && eq(contact.email, email));

  if (existingContact) {
    return new Response(JSON.stringify({ error: "Contact already exists" }), {
      status: 409,
    });
  }

  await db.insert(contact).values({
    id: randomUUID(),
    name,
    email,
    metadata,
    referenceId: userId,
  });

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuth(secretPOST);

const deleteBodySchema = z.object({
  /**
   * @description The email address of the contact to delete.
   * @required
   */
  email: z.string().email(),
});

async function secretDELETE(request: NextRequest, context: Context) {
  const {
    apiKey: { userId },
  } = context;

  const body = await request.json();
  const { email } = deleteBodySchema.parse(body);

  await db
    .delete(contact)
    .where(eq(contact.email, email) && eq(contact.referenceId, userId));

  return new Response(JSON.stringify({ status: 200 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const DELETE = withAuth(secretDELETE);
