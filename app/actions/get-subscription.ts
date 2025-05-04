"use server";

import { subscriptionActionClient } from "@/lib/safe-action";

export const getSubscription = subscriptionActionClient.action(
  async ({ ctx: { user, subscription } }) => {
    return { user, subscription };
  },
);
