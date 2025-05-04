export type SubscriptionTier = "free" | "plus" | "pro";

export type Subscription = {
  id: string;
  plan: string | null;
  seats: number | null;
  status: string | null;
  periodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  cancelAtPeriodEnd: boolean | null;
};
