import "server-only";

import { RiAlertLine, RiDiamondLine } from "@remixicon/react";
import { Suspense } from "react";

import { CurrentPlanCard } from "@/billing/components/current-plan-card";
import { ResolveSubscriptionButton } from "@/billing/components/resolve-subscription-button";
import { UpdatePlanDialog } from "@/billing/components/update-plan-dialog";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/core/components/empty-state";
import { authClient } from "@/lib/auth-client";
import { getSlugFromProductId } from "@/lib/configs/products";

export default async function BillingPage() {
  return (
    <div className="container">
      <Suspense fallback={<Skeleton className="h-38 rounded-xl border" />}>
        <BillingCard />
      </Suspense>
    </div>
  );
}

async function BillingCard() {
  const { data: customerState } = await authClient.customer.state();

  const subscription = customerState.activeSubscriptions.find(
    (subscription) => subscription.status === "",
  );

  if (!subscription) {
    return (
      <EmptyState
        icons={[RiDiamondLine, RiDiamondLine, RiDiamondLine]}
        title="You're not subscribed to any plan yet"
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
    <>
      {subscription.status !== "active" && (
        <Alert
          icon={<RiAlertLine className="opacity-60" />}
          action={<ResolveSubscriptionButton />}
          layout="row"
          variant="warning"
        >
          <p className="text-sm">Your subscription isn&apos;t active.</p>
        </Alert>
      )}

      <CurrentPlanCard
        slug={getSlugFromProductId(subscription.productId)}
        periodEnd={subscription.endsAt}
        cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
      />
    </>
  );
}
