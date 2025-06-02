import { z } from "zod";

import {
  feedbackMetadataBrowserSchema,
  feedbackMetadataDeviceSchema,
  feedbackMetadataOsSchema,
  feedbackTagSchema,
  voteStatusSchema,
} from "@/lib/schema";

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
  archived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Vote = z.infer<typeof voteSchema>;
