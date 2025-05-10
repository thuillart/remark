import { z } from "zod";

export const SubscriptionSlugSchema = z.enum(["free", "plus", "pro"]);
export type SubscriptionSlug = z.infer<typeof SubscriptionSlugSchema>;

export const ContactMetadataSchema = z.object({
  path: z.string(),
  tier: z.string(),
});
export type ContactMetadata = z.infer<typeof ContactMetadataSchema>;

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
