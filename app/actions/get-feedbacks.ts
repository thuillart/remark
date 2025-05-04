"use server";

import db from "@/lib/prisma/db";
import { authActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils/try-catch";
import { z } from "zod";

const schema = z.object({
  cursor: z.string().optional(),
});

type Feedback = {
  id: string;
  createdAt: Date;
};

export const getFeedbacks = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { cursor }, ctx: { user } }) => {
    const { data, error } = await tryCatch<Feedback[]>(
      db.feedback.findMany({
        take: 11,
        where: {
          referenceId: user.id,
          ...(cursor ? { id: { lt: cursor } } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
        },
      }),
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
