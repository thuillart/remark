import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getSlugFromProductId } from "@/lib/configs/products";
import type { SubscriptionSlug } from "@/lib/schema";
import { polarClient } from "./configs/polar";

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
    const customerState = await polarClient.customers.getStateExternal({
      externalId: user.id,
    });

    // If no customerState, default to free subscription
    const activeSubscriptions = customerState?.activeSubscriptions;

    const slug: SubscriptionSlug = activeSubscriptions.length
      ? getSlugFromProductId(activeSubscriptions[0].productId)
      : "free";

    return next({
      ctx: {
        ...user,
        subscription: {
          slug,
          polarCustomerId: customerState?.id,
        },
      },
    });
  },
);
