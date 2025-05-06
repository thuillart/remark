import type { CustomerState } from "@polar-sh/sdk/dist/commonjs/models/components/customerstate";
import type { CustomerStateSubscription } from "@polar-sh/sdk/src/models/components/customerstatesubscription";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getSlugFromProductId } from "@/lib/configs/products";
import type { SubscriptionTier } from "@/lib/types";
import { getBaseUrl } from "@/lib/utils";

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
    const response = await fetch(`${getBaseUrl()}/api/auth/state`, {
      headers: await headers(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch auth state: ${response.statusText}`);
    }

    const state = (await response.json()) as CustomerState;

    const activeSubscriptions =
      state.activeSubscriptions as CustomerStateSubscription[];

    const tier: SubscriptionTier = activeSubscriptions.length
      ? getSlugFromProductId(activeSubscriptions[0].productId)
      : "free";

    return next({
      ctx: {
        ...user,
        subscription: {
          tier,
          polarCustomerId: state.id,
        },
      },
    });
  },
);
