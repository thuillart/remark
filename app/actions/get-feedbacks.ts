"use server";

import { and, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db/drizzle";
import { feedbacks } from "@/lib/db/schema";
import { tryCatch } from "@/lib/helpers/try-catch";
import { authActionClient } from "@/lib/safe-action";

const schema = z.object({
  cursor: z.string().optional(),
});

export const getFeedbacks = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { cursor }, ctx: { user } }) => {
    const { data, error } = await tryCatch(
      db.query.feedbacks.findMany({
        limit: 11,
        where: cursor
          ? and(eq(feedbacks.referenceId, user.id), lt(feedbacks.id, cursor))
          : eq(feedbacks.referenceId, user.id),
        orderBy: [desc(feedbacks.createdAt)],
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    return {
      hasMore: data && data?.length > 10,
      feedbacks: data?.slice(0, 10) ?? [],
      nextCursor: data?.[data.length - 1]?.id,
    };
  });
