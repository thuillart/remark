import { NextResponse } from "next/server";
import { z } from "zod";

import db from "@/lib/prisma/db";
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
   * @description Whether the contact is a paying customer.
   * @optional
   */
  subscribed: z.boolean().default(false),
});

export const POST = authRoute
  .body(bodySchema)
  .handler(async (_req, { ctx, body }) => {
    const contact = await db.contact.findFirst({
      where: {
        referenceId: ctx.apiKey.userId,
        email: body.email,
      },
    });

    if (contact) {
      return NextResponse.json(
        { error: "Contact already exists" },
        { status: 409 },
      );
    }

    await db.contact.create({
      data: {
        email: body.email,
        lastName: body.lastName,
        firstName: body.firstName,
        referenceId: ctx.apiKey.userId,
      },
    });

    return NextResponse.json({ status: 200 });
  });

export const DELETE = authRoute.handler(async (_req, { ctx, body }) => {
  await db.contact.deleteMany({
    where: {
      email: body.email,
      referenceId: ctx.apiKey.userId,
    },
  });

  return NextResponse.json({ status: 200 });
});
