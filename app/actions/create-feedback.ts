"use server";

import { z } from "zod";

import { ADMIN_ID } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils";

const schema = z.object({
  text: z.string(),
});
export const createFeedback = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { text }, ctx: { user } }) => {
    const { error } = await tryCatch(
      db.insert(feedback).values({
        from: user.email,
        text,
        referenceId: ADMIN_ID,
      }),
    );

    if (error) {
      return { failure: error?.message };
    }

    return { success: true };
  });
