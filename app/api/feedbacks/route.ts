import { NextResponse } from "next/server";
import { z } from "zod";

import db from "@/lib/prisma/db";
import { rateLimitedRoute } from "@/lib/safe-route";

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

export const POST = rateLimitedRoute
  .body(bodySchema)
  .handler(async (_req, { ctx, body }) => {
    await db.feedback.create({
      data: {
        from: body.from,
        text: body.text,
        referenceId: ctx.apiKey.userId,
      },
    });

    return NextResponse.json({ status: 200 });
  });
