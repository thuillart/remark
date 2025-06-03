"use server";

import { google } from "@ai-sdk/google";
import { embed, generateText } from "ai";
import { randomUUID } from "crypto";
import dedent from "dedent";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { contact, feedback, vote } from "@/lib/db/schema";
import {
  actionClient,
  authActionClient,
  subscriptionActionClient,
} from "@/lib/safe-action";
import {
  feedbackEnrichmentSchema,
  feedbackInputMetadataSchema,
  feedbackMetadataBrowserSchema,
  feedbackMetadataDeviceSchema,
  feedbackMetadataOsSchema,
  feedbackMetadataSchema,
  SubscriptionSlugSchema,
  voteStatusSchema,
} from "@/lib/schema";
import { tryCatch } from "@/lib/utils";

type FeedbackMetadataBrowser = z.infer<typeof feedbackMetadataBrowserSchema>;
type FeedbackMetadataOs = z.infer<typeof feedbackMetadataOsSchema>;
type FeedbackMetadataDevice = z.infer<typeof feedbackMetadataDeviceSchema>;

export const createFeedback = authActionClient
  .schema(
    z.object({
      text: z.string(),
      metadata: feedbackMetadataSchema,
    }),
  )
  .action(async ({ parsedInput: { text, metadata }, ctx: { user } }) => {
    // 1. Enrich the feedback
    const result = await enrichFeedback({
      from: user.email,
      text,
      metadata,
    });

    if (!result.data) {
      return { failure: "We couldn't enrich your feedback" };
    }

    // We get the actual userId of team@remark.sh
    const teamUser = await db.query.user.findFirst({
      where: (user) => eq(user.email, "team@remark.sh"),
    });

    if (!teamUser) {
      return { failure: "We couldn't insert your feedback" };
    }

    const { error } = await tryCatch(
      db.insert(feedback).values({
        id: randomUUID(),
        from: user.email,
        text,
        tags: result.data.enrichment.tags,
        impact: result.data.enrichment.impact,
        subject: result.data.enrichment.subject,
        summary: result.data.enrichment.summary,
        metadata,
        embedding: result.data.embedding,
        referenceId: teamUser.id,
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    return { success: true };
  });

export const enrichFeedback = actionClient
  .schema(
    z.object({
      from: z.string().email(),
      text: z.string(),
      metadata: feedbackInputMetadataSchema,
    }),
  )
  .action(async ({ parsedInput: { from, text, metadata } }) => {
    const existingContact = await db.query.contact.findFirst({
      where: eq(contact.email, from),
    });

    console.log("we are about to pass ");

    const { text: output } = await generateText({
      model: google("gemini-2.5-flash-preview-04-17"),
      toolChoice: "none",
      prompt: dedent`
        You are a ticket-classification engine.

        Input: 

        ${JSON.stringify(
          {
            from,
            text,
            name: existingContact?.name,
            metadata,
          },
          null,
          2,
        )}

        Instructions: 

        1. Tags: 
           - For purely positive feedback: use "kudos"
           - For issues: select from: bug, feature_request, ui, ux, speed, security, pricing, billing, dx, i18n, compliance, a11y
           - Only use more than one tag when issues are unrelated
        2. Impact: Classify as: critical (blocking), major (significant), minor (low), positive (praise only)
        3. Subject:
           1. Write a natural 1-6 word phrase
           2. Start with the most impactful issue
           3. Use present tense and active voice
           4. Connect issues with "and" instead of commas
           Example: "Incorrect billing details and slow page"
        4. Summary: 
            1. List each issue as a separate point
            2. Write naturally as if telling a colleague about the feedback
            3. Keep the tone friendly but professional
            4. Specify when issues are user-specific
            5. Style rules:
               - Use present tense and active voice
               - Use contractions and informal verbs ("says" over "reports")
               - Avoid passive voice and formal terms
               - Use pronouns to avoid repetition
               - Start subsequent points with "Also" or "Additionally"
            Example:
            [
              "Armand says his subscription details aren't showing up correctly.",
              "Also, the billing page sometimes takes up to 30 seconds to load on his end."
            ]
        5. Metadata: Match input to exact values (case-sensitive). Omit if no match.
           - OS: "Mac OS"/"MacOS"/"Mac" → "macOS". Others: Windows, iOS, Android, Linux, ChromeOS, iPadOS, tvOS, watchOS
           - Device: mobile, tablet, desktop, console, smarttv, wearable, embedded
           - Browser: Chrome, Firefox, Safari, Edge, Opera, Brave, Arc, Zen, Samsung Internet
        6. The output must be a valid JSON object matching this structure:

        {
          "tags": [],
          "impact": "",
          "subject": "",
          "summary": [],
          "metadata": {}
        }
      `,
    });

    console.log("unprocessed output by AI: ", output);

    // Strip markdown code block formatting if present
    const cleanOutput = output.replace(/```json\n?|\n?```/g, "").trim();
    const parsedOutput = z.string().parse(cleanOutput);

    const enrichment = feedbackEnrichmentSchema.parse(JSON.parse(parsedOutput));

    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: enrichment.subject,
    });

    if (!embedding) {
      return { failure: "Failed to generate embedding" };
    }

    return { enrichment, embedding: JSON.stringify(embedding) };
  });

export const createApiKey = subscriptionActionClient
  .schema(
    z.object({
      name: z.string().min(1).max(50).trim(),
      pathname: z.string(),
    }),
  )
  .action(
    async ({
      parsedInput: { name, pathname },
      ctx: { user, subscription },
    }) => {
      const slugConfig = API_KEY_CONFIG[subscription.slug];

      const { data: apiKey, error } = await tryCatch(
        auth.api.createApiKey({
          body: {
            name,
            prefix: APP_NAME.toLowerCase().slice(0, 2) + "_",
            userId: user.id,
            metadata: { slug: subscription.slug },
            remaining: slugConfig.remaining,
            refillAmount: slugConfig.refillAmount,
            rateLimitMax: slugConfig.rateLimitMax,
            refillInterval: slugConfig.refillInterval,
            rateLimitEnabled: slugConfig.rateLimitEnabled,
            rateLimitTimeWindow: slugConfig.rateLimitTimeWindow,
          },
          headers: await headers(),
        }),
      );

      if (error) {
        return { failure: error.message };
      }

      revalidatePath(pathname);

      return {
        apiKey: {
          id: apiKey.id,
          key: apiKey.key,
          name: apiKey.name,
          start: apiKey.start,
          createdAt: new Date(apiKey.createdAt),
          lastRequest: apiKey.lastRequest ? new Date(apiKey.lastRequest) : null,
        },
      };
    },
  );

export const deleteApiKey = authActionClient
  .schema(
    z.object({
      keyId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { keyId } }) => {
    const { error } = await tryCatch(
      auth.api.deleteApiKey({
        body: { keyId },
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });

export const updateApiKey = authActionClient
  .schema(
    z.object({
      keyId: z.string(),
      newName: z.string().min(1).max(50).trim(),
    }),
  )
  .action(async ({ parsedInput: { keyId, newName } }) => {
    const { error } = await tryCatch(
      auth.api.updateApiKey({
        body: {
          keyId,
          name: newName,
        },
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });

export const updateApiKeysLimits = actionClient
  .schema(
    z.object({
      newSlug: SubscriptionSlugSchema,
    }),
  )
  .action(async ({ parsedInput: { newSlug } }) => {
    const { data: apiKeys, error } = await tryCatch(
      auth.api.listApiKeys({
        headers: await headers(),
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    const slugConfig = API_KEY_CONFIG[newSlug];

    // For each key, check if metadata.tier matches the new plan
    for (const key of apiKeys) {
      if (key.metadata?.slug === newSlug) continue; // If the key is already up-to-date, skip

      await auth.api.updateApiKey({
        body: {
          keyId: key.id,
          userId: key.userId,
          metadata: { slug: newSlug },
          remaining: slugConfig.remaining,
          refillAmount: slugConfig.refillAmount,
          rateLimitMax: slugConfig.rateLimitMax,
          refillInterval: slugConfig.refillInterval,
          rateLimitEnabled: slugConfig.rateLimitEnabled,
          rateLimitTimeWindow: slugConfig.rateLimitTimeWindow,
        },
      });
    }

    return { success: true };
  });

export const createVote = actionClient
  .schema(
    z.object({
      groupsIds: z.array(z.string()),
      referenceId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { groupsIds, referenceId } }) => {
    // Get all feedbacks for the given IDs first so we can include their details in the prompt
    const { data: feedbacks, error: feedbackError } = await tryCatch(
      db.select().from(feedback).where(inArray(feedback.id, groupsIds)),
    );

    if (feedbackError) {
      return { failure: feedbackError.message };
    }

    // Generate a merged subject and description using AI
    const { text: output } = await generateText({
      model: google("gemini-2.5-flash-preview-04-17"),
      // Might improve it
      prompt: dedent`
        You are a ticket-classification engine. Your task is to analyze multiple similar feedback entries and create a single, clear vote that represents their common request or issue.

        Input feedbacks:
        ${JSON.stringify(
          feedbacks.map((f) => ({
            subject: f.subject,
            text: f.text,
            impact: f.impact,
            tags: f.tags,
            metadata: f.metadata,
          })),
          null,
          2,
        )}

        Instructions:

        1. Title (1-6 words):
           - Write a natural, concise phrase
           - Start with the most impactful issue
           - Use present tense and active voice
           - Connect issues with "and" instead of commas
           Example: "Fix save button and improve performance"

        2. Description:
           - Write a detailed explanation of the request/issue
           - Include context from the original feedbacks
           - Keep the tone professional but friendly
           - Use present tense and active voice
           - Use contractions and informal verbs
           - Avoid passive voice and formal terms
           - Start with the most critical information
           - Include any relevant technical details or user context
           Example:
           "Users are experiencing issues with the save functionality. The button appears to be unresponsive, and in some cases, the page freezes when attempting to save. This affects users across different browsers and devices, with the most severe impact on mobile users. The issue seems to be related to the recent update to the form handling system."

        3. Tag (select ONE, maximum TWO if absolutely necessary):
           - For issues, choose the most relevant from:
             * bug: Technical issues or malfunctions
             * feature_request: New functionality requests
             * ui: Interface design issues
             * ux: User experience problems
             * speed: Performance issues
             * security: Security concerns
             * pricing: Pricing or billing issues
             * billing: Payment processing problems
             * dx: Developer experience issues
             * i18n: Internationalization/localization
             * compliance: Regulatory compliance
             * a11y: Accessibility issues

        4. Impact (select ONE):
           - critical: Blocking issue that prevents core functionality
           - major: Significant impact on user experience
           - minor: Low impact or easily worked around

        The output must be a valid JSON object matching this structure:
        {
          "title": "",
          "description": "",
          "tag": "",
          "impact": ""
        }
      `,
    });

    // Strip markdown code block formatting if present
    const cleanOutput = output.replace(/```json\n?|\n?```/g, "").trim();
    const parsedOutput = z.string().parse(cleanOutput);

    const voteData = z.object({
      title: z.string(),
      description: z.string(),
      tag: z.enum([
        "bug",
        "feature_request",
        "ui",
        "ux",
        "speed",
        "security",
        "pricing",
        "billing",
        "dx",
        "i18n",
        "compliance",
        "a11y",
      ]),
      impact: z.enum(["critical", "major", "minor"]),
    });

    const { data: jsonData, error: jsonError } = await tryCatch(
      Promise.resolve(JSON.parse(parsedOutput)),
    );
    if (jsonError) {
      return { failure: "Failed to parse JSON from AI response" };
    }

    const result = voteData.safeParse(jsonData);
    if (!result.success) {
      return { failure: "Failed to parse vote data from AI response" };
    }
    const parsedVoteData = result.data;

    const count = groupsIds.length;

    // Extract and merge metadata from all feedbacks
    const browsers = new Set<FeedbackMetadataBrowser>();
    const operatingSystems = new Set<FeedbackMetadataOs>();
    const devices = new Set<FeedbackMetadataDevice>();

    feedbacks.forEach((f) => {
      if (f.metadata?.browser)
        browsers.add(f.metadata.browser as FeedbackMetadataBrowser);
      if (f.metadata?.os)
        operatingSystems.add(f.metadata.os as FeedbackMetadataOs);
      if (f.metadata?.device)
        devices.add(f.metadata.device as FeedbackMetadataDevice);
    });

    const { error } = await tryCatch(
      db.insert(vote).values({
        id: crypto.randomUUID(),
        count,
        title: parsedVoteData.title,
        description: parsedVoteData.description,
        browsers: Array.from(browsers),
        operatingSystems: Array.from(operatingSystems),
        devices: Array.from(devices),
        tags: [parsedVoteData.tag],
        impact: parsedVoteData.impact,
        referenceId,
        feedbackIds: groupsIds,
        status: "pending",
      }),
    );

    if (error) {
      return { failure: error.message };
    }

    return { success: true };
  });

export const updateVote = subscriptionActionClient
  .schema(
    z.object({
      voteIds: z.array(z.string()).min(1),
      status: voteStatusSchema,
    }),
  )
  .action(
    async ({ parsedInput: { voteIds, status }, ctx: { subscription } }) => {
      if (subscription.slug === "free") {
        return { failure: "This isn't available on the free plan." };
      }

      const { error } = await tryCatch(
        db.update(vote).set({ status }).where(inArray(vote.id, voteIds)),
      );

      if (error) {
        return { failure: error.message };
      }

      revalidatePath("/votes");
      return { success: true };
    },
  );

export const deleteVote = subscriptionActionClient
  .schema(
    z.object({
      voteIds: z.array(z.string()).min(1),
    }),
  )
  .action(async ({ parsedInput: { voteIds }, ctx: { subscription } }) => {
    if (subscription.slug === "free") {
      return { failure: "This isn't available on the free plan." };
    }

    const { error } = await tryCatch(
      db.delete(vote).where(inArray(vote.id, voteIds)),
    );

    if (error) {
      return { failure: error.message };
    }

    revalidatePath("/votes");
    return { success: true };
  });

export const archiveVote = subscriptionActionClient
  .schema(
    z.object({
      voteIds: z.array(z.string()).min(1),
    }),
  )
  .action(async ({ parsedInput: { voteIds }, ctx: { subscription } }) => {
    if (subscription.slug === "free") {
      return { failure: "This isn't available on the free plan." };
    }

    const { error } = await tryCatch(
      db
        .update(vote)
        .set({ status: "closed" })
        .where(inArray(vote.id, voteIds)),
    );

    if (error) {
      return { failure: error.message };
    }

    revalidatePath("/votes");
    return { success: true };
  });

export const unarchiveVote = subscriptionActionClient
  .schema(
    z.object({
      voteIds: z.array(z.string()).min(1),
    }),
  )
  .action(async ({ parsedInput: { voteIds }, ctx: { subscription } }) => {
    if (subscription.slug === "free") {
      return { failure: "This isn't available on the free plan." };
    }

    const { error } = await tryCatch(
      db
        .update(vote)
        .set({ status: "pending" })
        .where(inArray(vote.id, voteIds)),
    );

    if (error) {
      return { failure: error.message };
    }

    revalidatePath("/votes");
    return { success: true };
  });
