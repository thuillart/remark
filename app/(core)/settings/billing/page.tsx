import { CreditCard } from "lucide-react";
import { headers } from "next/headers";
import React from "react";

import { CurrentPlan } from "@/billing/components/current-plan";
import { UpdatePlanDialog } from "@/billing/components/update-plan-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/core/components/empty-state";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/configs/polar";
import { getSlugFromProductId } from "@/lib/configs/products";

export default function BillingPage() {
  return (
    <div className="container">
      <React.Suspense
        fallback={<Skeleton className="h-38 rounded-xl border" />}
      >
        <BillingCard />
      </React.Suspense>
    </div>
  );
}

async function BillingCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session.user;

  const customerState = await polarClient.customers.getStateExternal({
    externalId: user.id,
  });

  const subscription = customerState?.activeSubscriptions?.find(
    (subscription) => subscription.status === "active",
  );

  if (!subscription) {
    return (
      <EmptyState
        icons={[CreditCard, CreditCard, CreditCard]}
        title="You are not subscribed to any plan yet"
        action={
          <UpdatePlanDialog currentPlan="free">
            <Button
              variant="outline"
              className="mt-4 shadow-sm active:shadow-none"
            >
              Change plan
            </Button>
          </UpdatePlanDialog>
        }
        description="Upgrade for AI at your fingertips, no daily limit and many more."
      />
    );
  }

  return (
    <CurrentPlan
      slug={getSlugFromProductId(subscription.productId)}
      startedAt={subscription.startedAt}
      currentPeriodEnd={subscription.currentPeriodEnd}
      cancelAtPeriodEnd={Boolean(subscription.cancelAtPeriodEnd)}
    />
  );
}
