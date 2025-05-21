import { and, eq, inArray, not, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

import { polarClient } from "@/lib/configs/polar";
import { getSlugFromProductId } from "@/lib/configs/products";
import { createVote } from "@/lib/db/actions";
import { db } from "@/lib/db/drizzle";
import { feedback, user, vote } from "@/lib/db/schema";
import { tryCatch } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const bearerToken = request.headers.get("authorization");

  if (bearerToken !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get users with feedback
  const users = await db
    .select({ id: user.id })
    .from(user)
    .innerJoin(feedback, eq(feedback.referenceId, user.id))
    .groupBy(user.id);

  const paidIds: string[] = [];

  // Filter paid users
  for (const user of users) {
    const { data: customerState, error } = await tryCatch(
      polarClient.customers.getStateExternal({
        externalId: user.id,
      }),
    );

    if (error) {
      console.error("Couldn't get customer state: ", error);
      continue;
    }

    const activeSubscription = customerState.activeSubscriptions?.find(
      (subscription) => subscription.status === "active",
    );

    const slug = getSlugFromProductId(activeSubscription?.productId) ?? "free";

    if (slug === "free") {
      continue;
    }

    paidIds.push(user.id);
  }

  // Find similar feedbacks
  const SIMILARITY_THRESHOLD = 0.7; // 70%

  // Get all feedback IDs that are already in votes
  const existingVotes = await db
    .select({ feedbackIds: vote.feedbackIds })
    .from(vote);

  const processedFeedbackIds = new Set(
    existingVotes.flatMap((vote) => vote.feedbackIds),
  );

  const pairs = await db
    .select({
      feedback1: {
        id: feedback.id,
        subject: feedback.subject,
        referenceId: feedback.referenceId,
      },
      feedback2: {
        id: sql<string>`feedback2.id`,
        subject: sql<string>`feedback2.subject`,
        referenceId: sql<string>`feedback2.referenceId`,
      },
      similarity: sql<number>`1 - (${feedback.embedding} <=> feedback2.embedding)`,
    })
    .from(feedback)
    .innerJoin(
      feedback,
      sql`${feedback.id} < feedback2.id 
          AND ${feedback.referenceId} = feedback2.referenceId
          AND 1 - (${feedback.embedding} <=> feedback2.embedding) > ${SIMILARITY_THRESHOLD}`,
    )
    .where(
      and(
        inArray(feedback.referenceId, paidIds),
        not(inArray(feedback.id, Array.from(processedFeedbackIds))),
      ),
    );

  // Group similar feedbacks
  const groups = new Map<string, Set<string>>();

  for (const pair of pairs) {
    const id1 = pair.feedback1.id;
    const id2 = pair.feedback2.id;

    let groupId = [...groups.entries()].find(
      ([, ids]) => ids.has(id1) || ids.has(id2),
    )?.[0];

    if (!groupId) {
      groupId = id1;
      groups.set(groupId, new Set([id1, id2]));
    } else {
      groups.get(groupId)?.add(id1).add(id2);
    }
  }

  // Create votes for each group
  for (const [groupId, ids] of groups) {
    const groupFeedbacks = await db
      .select({ subject: feedback.subject })
      .from(feedback)
      .where(inArray(feedback.id, Array.from(ids)));

    const referenceId =
      pairs.find((p) => p.feedback1.id === groupId)?.feedback1.referenceId ??
      pairs.find((p) => p.feedback2.id === groupId)?.feedback2.referenceId;

    const result = await createVote({
      subjects: groupFeedbacks.map((groupFeedback) => groupFeedback.subject),
      groupsIds: Array.from(ids),
      referenceId,
    });

    if (result?.data?.failure) {
      console.error("Couldn't create vote: ", result.data.failure);
    }
  }

  return Response.json({ success: true });
}
