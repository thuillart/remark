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
    path: z.string().optional(), // e.g. "/search"
  })
  .optional();
export type FeedbackMetadata = z.infer<typeof feedbackMetadataSchema>;

export const feedbackTagSchema = z.enum([
  "bug",
  "feature_request",
  "enhancement",
  "ui",
  "ux",
  "performance",
  "security",
  "billing",
  "api",
  "dx",
  "lang",
  "legal",
  "appraisal",
]);
export type FeedbackTag = z.infer<typeof feedbackTagSchema>;

export const feedbackImpactSchema = z.enum(["minor", "major", "critical"]);
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
