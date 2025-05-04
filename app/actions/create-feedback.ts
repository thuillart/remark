"use server";

import { z } from "zod";

import { ADMIN_ID } from "@/lib/contants";
import { tryCatch } from "@/lib/helpers/try-catch";
import { authActionClient } from "@/lib/safe-action";
import db from "@/prisma/db";

const schema = z.object({
  text: z.string(),
});

export const createFeedback = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { text }, ctx: { user } }) => {
    const { error } = await tryCatch(
      db.feedback.create({
        data: {
          from: user.email,
          text,
          referenceId: ADMIN_ID,
        },
      }),
    );

    if (error) {
      console.log("error", error);
      return { failure: error?.message };
    }

    return { success: true };
  });
