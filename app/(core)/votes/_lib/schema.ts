import { z } from "zod";

import { voteStatusSchema } from "@/lib/schema";

export const voteSchema = z.object({
  id: z.string(),
  subject: z.string(),
  count: z.number(),
  referenceId: z.string(),
  status: voteStatusSchema,
  feedbackIds: z.array(z.string()),
  archived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Vote = z.infer<typeof voteSchema>;
