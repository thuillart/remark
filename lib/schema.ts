import { z } from "zod";

export const SubscriptionSlugSchema = z.enum(["free", "plus", "pro"]);
export type SubscriptionSlug = z.infer<typeof SubscriptionSlugSchema>;

export const ContactMetadataSchema = z
  .object({
    tier: z.string().optional(), // e.g. "free"
  })
  .optional();
export type ContactMetadata = z.infer<typeof ContactMetadataSchema>;

export const FeedbackMetadataSchema = z
  .object({
    path: z.string().optional(), // e.g. "/search"
  })
  .optional();
export type FeedbackMetadata = z.infer<typeof FeedbackMetadataSchema>;

export const FeedbackTagSchema = z.enum([
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
]);
export type FeedbackTag = z.infer<typeof FeedbackTagSchema>;

export const FeedbackEnrichmentSchema = z.object({
  tags: z.array(FeedbackTagSchema),
  impact: z.enum(["minor", "major", "critical"]),
  subject: z.string(),
  summary: z.string(),
});
export type FeedbackEnrichment = z.infer<typeof FeedbackEnrichmentSchema>;

export const FeedbackInputSchema = z.object({
  from: z.string().email(),
  text: z.string(),
  name: z.string().optional(),
  metadata: FeedbackMetadataSchema,
});
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;
