"use server";

import { z } from "zod";

import db from "@/lib/prisma/db";
import { authActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils/try-catch";

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
          referenceId: "",
        },
      }),
    );

    if (error) {
      console.log("error", error);
      return { failure: error?.message };
    }

    return { success: true };
  });
