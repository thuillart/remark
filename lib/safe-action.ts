import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/helpers/try-catch";
import db from "@/prisma/db";

type Subscription = {
  plan: string | null;
  status: string | null;
  periodEnd: Date | null;
  stripeCustomerId: string | null;
  cancelAtPeriodEnd: boolean | null;
};

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    throw new Error("Please sign in to continue");
  }

  return next({ ctx: { user: session.user } });
});

export const subscriptionActionClient = authActionClient.use(
  async ({ next, ctx: { user } }) => {
    const { data, error } = await tryCatch<Subscription>(
      db.subscription.findFirst({
        where: {
          stripeCustomerId: user.stripeCustomerId,
        },
        select: {
          plan: true,
          status: true,
          periodEnd: true,
          stripeCustomerId: true,
          cancelAtPeriodEnd: true,
        },
      }),
    );

    if (error) {
      throw new Error("Failed to get subscription");
    }

    const tier: "plus" | "free" = data?.plan ? "plus" : "free";

    return next({
      ctx: {
        ...user,
        subscription: {
          tier,
          ...data,
        },
      },
    });
  },
);
