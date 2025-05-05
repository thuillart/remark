import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { subscription } from "@/lib/db/schema";
import type { SubscriptionTier } from "@/lib/types";
import { tryCatch } from "@/lib/utils/try-catch";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Please sign in to continue");
  }

  return next({
    ctx: {
      user: session.user,
    },
  });
});

export const subscriptionActionClient = authActionClient.use(
  async ({ next, ctx: { user } }) => {
    const { data, error } = await tryCatch(
      db
        .select({
          plan: subscription.plan,
          status: subscription.status,
          periodEnd: subscription.periodEnd,
          stripeCustomerId: subscription.stripeCustomerId,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        })
        .from(subscription)
        .where(eq(subscription.stripeCustomerId, user.stripeCustomerId!))
        .limit(1),
    );

    if (error) {
      throw new Error("Failed to get subscription");
    }

    return next({
      ctx: {
        ...user,
        subscription: {
          ...data[0],
          plan: (data[0]?.plan as SubscriptionTier) ?? "free",
        },
      },
    });
  },
);
