import { z } from "zod";

import {
  feedbackImpactSchema,
  feedbackMetadataSchema,
  feedbackTagSchema,
} from "@/lib/schema";

export const feedbackSchema = z.object({
  id: z.string(),
  tags: z.array(feedbackTagSchema),
  from: z.string().email(),
  impact: feedbackImpactSchema,
  subject: z.string(),
  text: z.string(),
  summary: z.string(),
  metadata: feedbackMetadataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Feedback = z.infer<typeof feedbackSchema>;
