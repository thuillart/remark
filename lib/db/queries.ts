"use server";

import { and, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils";
import { subscriptionActionClient } from "@/lib/safe-action";

export const getSubscription = subscriptionActionClient.action(
  async ({ ctx: { user, subscription } }) => {
    return { user, subscription };
  },
);

export const getFeedbacks = authActionClient
  .schema(
    z.object({
      cursor: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { cursor }, ctx: { user } }) => {
    const { data, error } = await tryCatch(
      db
        .select()
        .from(feedback)
        .where(
          cursor
            ? and(eq(feedback.referenceId, user.id), lt(feedback.id, cursor))
            : eq(feedback.referenceId, user.id),
        )
        .orderBy(desc(feedback.createdAt))
        .limit(11),
    );

    if (error) {
      return { failure: error.message };
    }

    return {
      hasMore: data && data.length > 10,
      feedbacks: data?.slice(0, 10) ?? [],
      nextCursor: data?.[data.length - 1]?.id,
    };
  });
