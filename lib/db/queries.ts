"use server";

import { and, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db/drizzle";
import { feedback } from "@/lib/db/schema";
import { authActionClient, subscriptionActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils";

export const getSubscription = subscriptionActionClient.action(
  async ({ ctx: { user, subscription } }) => {
    return { user, subscription };
  },
);

export const getFeedbacks = authActionClient
  .inputSchema(
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

export const getFeedbackById = authActionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const { data, error } = await tryCatch(
      db
        .select()
        .from(feedback)
        .where(and(eq(feedback.id, id), eq(feedback.referenceId, user.id))),
    );

    if (error) {
      return { failure: error.message };
    }

    return { feedback: data?.[0] };
  });
