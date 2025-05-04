import type { User } from "better-auth";

export type SubscriptionTier = "free" | "plus" | "pro";

export type Subscription = {
  id: string;
  plan: string | null;
  status: string | null;
  periodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  cancelAtPeriodEnd: boolean | null;
  seats: number | null;
};

export type SubscriptionWithTier = Subscription & {
  tier: SubscriptionTier;
};

export type UserWithSubscription = User & {
  subscription: SubscriptionWithTier;
};
