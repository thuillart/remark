import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  start: z.string().nullable(),
  createdAt: z.date(),
  lastRequest: z.date().nullable(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;
