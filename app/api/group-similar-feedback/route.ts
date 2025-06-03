import { and, eq, inArray, not, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

import { polarClient } from "@/lib/configs/polar";
import { getSlugFromProductId } from "@/lib/configs/products";
import { createVote } from "@/lib/db/actions";
import { db } from "@/lib/db/drizzle";
import { feedback, user, vote } from "@/lib/db/schema";
import { FeedbackImpact } from "@/lib/schema";
import { tryCatch } from "@/lib/utils";

export async function GET(request: NextRequest) {
  console.log("🚀 Starting group-similar-feedback cron job");

  const bearerToken = request.headers.get("authorization");

  if (bearerToken !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("❌ Unauthorized: Invalid bearer token");
    return new Response("Unauthorized", { status: 401 });
  }

  // Get users with feedback
  console.log("📊 Getting users with feedback...");
  const users = await db
    .select({ id: user.id })
    .from(user)
    .innerJoin(feedback, eq(feedback.referenceId, user.id))
    .groupBy(user.id);
  console.log(`✅ Found ${users.length} users with feedback`);

  if (users.length === 0) {
    console.log("ℹ️ No users with feedback found, skipping processing");
    return Response.json({ success: true });
  }

  const paidIds: string[] = [];

  // Filter paid users
  console.log("💰 Filtering paid users...");
  for (const user of users) {
    const { data: customerState, error } = await tryCatch(
      polarClient.customers.getStateExternal({
        externalId: user.id,
      }),
    );

    if (error) {
      console.error(
        `❌ Couldn't get customer state for user ${user.id}:`,
        error,
      );
      continue;
    }

    const activeSubscription = customerState.activeSubscriptions?.find(
      (subscription) => subscription.status === "active",
    );

    const slug = getSlugFromProductId(activeSubscription?.productId) ?? "free";

    if (slug === "free") {
      console.log(`ℹ️ Skipping free user ${user.id}`);
      continue;
    }

    paidIds.push(user.id);
  }
  console.log(`✅ Found ${paidIds.length} paid users`);

  if (paidIds.length === 0) {
    console.log("ℹ️ No paid users found, skipping processing");
    return Response.json({ success: true });
  }

  // Get all feedback IDs that are already in votes
  console.log("📝 Getting already processed feedbacks...");
  const existingVotes = await db
    .select({ feedbackIds: vote.feedbackIds })
    .from(vote);

  const processedFeedbackIds = new Set(
    existingVotes.flatMap((vote) => vote.feedbackIds),
  );
  console.log(
    `ℹ️ Found ${processedFeedbackIds.size} already processed feedbacks`,
  );

  // Ensure pgvector extension is enabled
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);

  // First, handle single feedbacks that don't have any similar matches
  console.log("🔍 Processing single feedbacks...");
  const singleFeedbacks = await db
    .select()
    .from(feedback)
    .where(
      and(
        inArray(feedback.referenceId, paidIds),
        not(inArray(feedback.id, Array.from(processedFeedbackIds))),
        // Exclude positive feedback
        not(eq(feedback.impact, "positive")),
        not(sql`${feedback.tags}::text[] @> ARRAY['kudos']::text[]`),
      ),
    );

  // Create votes for single feedbacks
  for (const singleFeedback of singleFeedbacks) {
    console.log(`\nProcessing single feedback ${singleFeedback.id}`);

    const result = await createVote({
      groupsIds: [singleFeedback.id],
      referenceId: singleFeedback.referenceId,
    });

    if (result?.data?.failure) {
      console.error(
        `❌ Couldn't create vote for single feedback ${singleFeedback.id}:`,
        result.data.failure,
      );
    } else {
      console.log(
        `✅ Successfully created vote for single feedback ${singleFeedback.id}`,
      );
    }
  }

  // Now proceed with finding similar pairs
  console.log("\n🔍 Finding similar feedback pairs...");
  const SIMILARITY_THRESHOLDS: Record<
    Exclude<FeedbackImpact, "positive">,
    number
  > = {
    critical: 0.8,
    major: 0.75,
    minor: 0.65,
  };

  const pairs = await db
    .select({
      feedback1: {
        id: feedback.id,
        subject: feedback.subject,
        referenceId: feedback.referenceId,
        impact: feedback.impact,
        tags: feedback.tags,
      },
      feedback2: {
        id: sql<string>`f2.id`,
        subject: sql<string>`f2.subject`,
        referenceId: sql<string>`f2.reference_id`,
        impact: sql<string>`f2.impact`,
        tags: sql<string[]>`f2.tags`,
      },
      similarity: sql<number>`1 - ((${feedback.embedding}::vector) <=> (f2.embedding::vector))`,
    })
    .from(feedback)
    .innerJoin(
      sql`${feedback} as f2`,
      sql`${feedback.id} < f2.id 
          AND ${feedback.referenceId} = f2.reference_id
          AND (
            -- Critical issues need highest similarity
            (${feedback.impact} = 'critical' AND f2.impact = 'critical' AND 1 - ((${feedback.embedding}::vector) <=> (f2.embedding::vector)) > ${SIMILARITY_THRESHOLDS.critical})
            OR
            -- Major issues need high similarity
            (${feedback.impact} = 'major' AND f2.impact = 'major' AND 1 - ((${feedback.embedding}::vector) <=> (f2.embedding::vector)) > ${SIMILARITY_THRESHOLDS.major})
            OR
            -- Minor issues can be more lenient
            (${feedback.impact} = 'minor' AND f2.impact = 'minor' AND 1 - ((${feedback.embedding}::vector) <=> (f2.embedding::vector)) > ${SIMILARITY_THRESHOLDS.minor})
            OR
            -- Cross-impact matching (e.g., critical with major)
            (${feedback.impact} != f2.impact AND 1 - ((${feedback.embedding}::vector) <=> (f2.embedding::vector)) > ${SIMILARITY_THRESHOLDS.major})
          )`,
    )
    .where(
      and(
        inArray(feedback.referenceId, paidIds),
        not(inArray(feedback.id, Array.from(processedFeedbackIds))),
        // Exclude positive feedback
        not(eq(feedback.impact, "positive")),
        not(sql`${feedback.tags}::text[] @> ARRAY['kudos']::text[]`),
        // Same for f2
        not(eq(sql`f2.impact`, "positive")),
        not(sql`f2.tags::text[] @> ARRAY['kudos']::text[]`),
      ),
    );
  console.log(`✅ Found ${pairs.length} similar feedback pairs`);

  if (pairs.length === 0) {
    console.log("ℹ️ No similar feedback pairs found, skipping processing");
    return Response.json({ success: true });
  }

  // Group similar feedbacks
  console.log("👥 Grouping similar feedbacks...");
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
  console.log(`✅ Created ${groups.size} groups of similar feedbacks`);

  if (groups.size === 0) {
    console.log("ℹ️ No groups created, skipping vote creation");
    return Response.json({ success: true });
  }

  // Create votes for each group
  console.log("🗳️ Creating votes for each group...");
  for (const [groupId, ids] of groups) {
    console.log(`\nProcessing group ${groupId} with ${ids.size} feedbacks`);

    const groupFeedbacks = await db
      .select({ subject: feedback.subject })
      .from(feedback)
      .where(inArray(feedback.id, Array.from(ids)));

    const referenceId =
      pairs.find((p) => p.feedback1.id === groupId)?.feedback1.referenceId ??
      pairs.find((p) => p.feedback2.id === groupId)?.feedback2.referenceId;

    console.log(
      `Creating vote for user ${referenceId} with subjects:`,
      groupFeedbacks.map((f) => f.subject).join(", "),
    );

    const result = await createVote({
      groupsIds: Array.from(ids),
      referenceId,
    });

    if (result?.data?.failure) {
      console.error(
        `❌ Couldn't create vote for group ${groupId}:`,
        result.data.failure,
      );
    } else {
      console.log(`✅ Successfully created vote for group ${groupId}`);
    }
  }

  console.log("\n✨ Cron job completed successfully");
  return Response.json({ success: true });
}

// For local testing
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not available in production for now", { status: 403 });
  }

  return GET(request);
}
