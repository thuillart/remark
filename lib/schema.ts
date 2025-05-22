import { z } from "zod";

export const SubscriptionSlugSchema = z.enum(["free", "plus", "pro"]);
export type SubscriptionSlug = z.infer<typeof SubscriptionSlugSchema>;

export const contactMetadataSchema = z
  .object({
    tier: z.string().optional(), // e.g. "free"
  })
  .optional();
export type ContactMetadata = z.infer<typeof contactMetadataSchema>;

export const feedbackMetadataSchema = z
  .object({
    os: z.string().optional(),
    path: z.string().optional(), // e.g. "/search"
    device: z.string().optional(),
    browser: z.string().optional(),
  })
  .optional();
export type FeedbackMetadata = z.infer<typeof feedbackMetadataSchema>;

export const feedbackTagSchema = z.enum([
  /**
   * Something's not working as expected.
   */
  "bug",
  /**
   * Asking for a missing feature.
   */
  "feature_request",
  /**
   * The way it looks could be better.
   */
  "ui",
  /**
   * The way it's designed to work could be better.
   */
  "ux",
  /**
   * When it's slow or laggy.
   */
  "speed",
  /**
   * Found a security problem.
   */
  "security",
  /**
   * The price doesn't feel right.
   */
  "pricing",
  /**
   * Anything related to billing or payments.
   */
  "billing",
  /**
   * The development experience (e.g. docs, API, SDKs, etc.) could be better.
   */
  "dx",
  /**
   * When translations aren't correct.
   */
  "i18n",
  /**
   * Something about terms or privacy, or legal.
   */
  "compliance",
  /**
   * Not accessible enough for some users.
   */
  "a11y",
  /**
   * Anything that's positive and/or encouraging.
   */
  "kudos",
]);
export type FeedbackTag = z.infer<typeof feedbackTagSchema>;

export const feedbackImpactSchema = z.enum([
  "minor",
  "major",
  "positive",
  "critical",
]);
export type FeedbackImpact = z.infer<typeof feedbackImpactSchema>;

export const feedbackEnrichmentSchema = z.object({
  tags: z.array(feedbackTagSchema),
  impact: feedbackImpactSchema,
  subject: z.string(),
  summary: z.string(),
});
export type FeedbackEnrichment = z.infer<typeof feedbackEnrichmentSchema>;

export const feedbackInputSchema = z.object({
  from: z.string().email(),
  text: z.string(),
  name: z.string().optional(),
  metadata: feedbackMetadataSchema,
});
export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

export const voteStatusSchema = z.enum(["open", "in_progress", "completed"]);
export type VoteStatus = z.infer<typeof voteStatusSchema>;
