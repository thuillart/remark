import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db/drizzle";
import { contact } from "@/lib/db/schema";
import { authRoute } from "@/lib/safe-route";

const bodySchema = z.object({
  /**
   * @description The email address of the contact.
   * @required
   */
  email: z.string().email(),
  /**
   * @description The last name of the contact.
   * @optional
   */
  lastName: z.string().optional(),
  /**
   * @description The first name of the contact.
   * @optional
   */
  firstName: z.string().optional(),
  /**
   * @description Metadata about the contact.
   * @optional
   */
  metadata: z.record(z.string(), z.string()).optional(),
});

export const POST = authRoute
  .body(bodySchema)
  .handler(async (_req, { ctx, body }) => {
    const [existingContact] = await db
      .select()
      .from(contact)
      .where(
        eq(contact.referenceId, ctx.apiKey.userId) &&
          eq(contact.email, body.email),
      );

    if (existingContact) {
      return NextResponse.json(
        { error: "Contact already exists" },
        { status: 409 },
      );
    }

    await db.insert(contact).values({
      email: body.email,
      lastName: body.lastName,
      metadata: body.metadata,
      firstName: body.firstName,
      subscribed: body.subscribed,
      referenceId: ctx.apiKey.userId,
    });

    return NextResponse.json({ status: 200 });
  });

export const DELETE = authRoute.handler(async (_req, { ctx, body }) => {
  await db
    .delete(contact)
    .where(
      eq(contact.email, body.email) &&
        eq(contact.referenceId, ctx.apiKey.userId),
    );

  return NextResponse.json({ status: 200 });
});