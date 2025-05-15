import { contactMetadataSchema } from "@/lib/schema";
import { z } from "zod";

export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  metadata: contactMetadataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  referenceId: z.string(),
});
export type Contact = z.infer<typeof contactSchema>;
