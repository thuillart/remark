import { z } from "zod";

export const SubscriptionSlugSchema = z.enum(["free", "plus", "pro"]);
export type SubscriptionSlug = z.infer<typeof SubscriptionSlugSchema>;

export const contactMetadataSchema = z
  .object({
    tier: z.string().optional(), // e.g. "free"
  })
  .optional();
export type ContactMetadata = z.infer<typeof contactMetadataSchema>;

export const feedbackTagSchema = z.enum([
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

export const feedbackMetadataOsSchema = z.enum([
  "Windows",
  "macOS",
  "iOS",
  "Android",
  "Linux",
  "ChromeOS",
  "iPadOS",
  "tvOS",
  "watchOS",
]);
export type FeedbackMetadataOs = z.infer<typeof feedbackMetadataOsSchema>;

export const feedbackMetadataDeviceSchema = z.enum([
  "mobile",
  "tablet",
  "desktop",
  "console",
  "smarttv",
  "wearable",
  "embedded",
]);
export type FeedbackMetadataDevice = z.infer<
  typeof feedbackMetadataDeviceSchema
>;

export const feedbackMetadataBrowserSchema = z.enum([
  "Chrome",
  "Firefox",
  "Safari",
  "Edge",
  "Opera",
  "Brave",
  "Arc",
  "Zen",
  "Samsung Internet",
]);
export type FeedbackMetadataBrowser = z.infer<
  typeof feedbackMetadataBrowserSchema
>;

export const feedbackEnrichmentMetadataSchema = z.object({
  os: feedbackMetadataOsSchema.optional(),
  device: feedbackMetadataDeviceSchema.optional(),
  browser: feedbackMetadataBrowserSchema.optional(),
});
export type FeedbackEnrichmentMetadata = z.infer<
  typeof feedbackEnrichmentMetadataSchema
>;

export const feedbackEnrichmentSchema = z.object({
  tags: z.array(feedbackTagSchema),
  impact: feedbackImpactSchema,
  subject: z.string(),
  summary: z.array(z.string()),
  metadata: feedbackEnrichmentMetadataSchema,
});
export type FeedbackEnrichment = z.infer<typeof feedbackEnrichmentSchema>;

export const feedbackInputMetadataSchema = z
  .object({
    os: z.string().optional(),
    path: z.string().optional(),
    device: z.string().optional(),
    browser: z.string().optional(),
  })
  .optional();
export type FeedbackInputMetadata = z.infer<typeof feedbackInputMetadataSchema>;

export const feedbackInputSchema = z.object({
  from: z.string().email(),
  text: z.string(),
  name: z.string().optional(),
  metadata: feedbackInputMetadataSchema,
});
export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

export const feedbackMetadataSchema = feedbackEnrichmentMetadataSchema
  .extend({
    path: z.string().optional(),
  })
  .optional();
export type FeedbackMetadata = z.infer<typeof feedbackMetadataSchema>;

export const voteStatusSchema = z.enum([
  "pending",
  "reviewing",
  "planned",
  "in_progress",
  "completed",
  "closed",
]);
export type VoteStatus = z.infer<typeof voteStatusSchema>;

export const voteImpactSchema = z.enum(["minor", "major", "critical"]);
export type VoteImpact = z.infer<typeof voteImpactSchema>;

export const voteSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  count: z.number(),
  impact: voteImpactSchema,
  browsers: z.array(feedbackMetadataBrowserSchema),
  operatingSystems: z.array(feedbackMetadataOsSchema),
  devices: z.array(feedbackMetadataDeviceSchema),
  tags: z.array(feedbackTagSchema),
  referenceId: z.string(),
  status: voteStatusSchema,
  feedbackIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Vote = z.infer<typeof voteSchema>;
