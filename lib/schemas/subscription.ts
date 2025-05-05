import { z } from "zod";

export const subscriptionTierSchema = z.enum(["free", "plus", "pro"]);
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;
