import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getSlugFromProductId } from "@/lib/configs/products";
import type { SubscriptionSlug } from "@/lib/schema";
import { authClient } from "./auth-client";

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
    const { data: customerState, error } = await authClient.customer.state();

    console.log(customerState);

    if (error || !customerState) {
      console.log("middleware couldn't get customer state (polar)");
      throw new Error(`Failed to get subscription state: ${error.message}`);
    }

    const activeSubscriptions = customerState.activeSubscriptions;

    const slug: SubscriptionSlug = activeSubscriptions.length
      ? getSlugFromProductId(activeSubscriptions[0].productId)
      : "free";

    console.log("our slug", slug);

    return next({
      ctx: {
        ...user,
        subscription: {
          slug,
          polarCustomerId: customerState.id,
        },
      },
    });
  },
);
