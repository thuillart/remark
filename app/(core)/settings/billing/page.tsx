import "server-only";

import { getSubscription } from "@/actions/get-subscription";
import { Suspense } from "react";

import { CurrentPlanCard } from "@/billing/components/current-plan-card";
import { UpgradePlanCard } from "@/billing/components/upgrade-plan-card";

export default async function BillingPage() {
  return (
    <div className="container">
      <Suspense>
        <BillingCard />
      </Suspense>
    </div>
  );
}

async function BillingCard() {
  const result = await getSubscription({});

  const plan = result.data.subscription.plan;
  const status = result.data.subscription.status;
  const periodEnd = result.data.subscription.periodEnd;
  const cancelAtPeriodEnd = result.data.subscription.cancelAtPeriodEnd;

  if (plan === "free") {
    return <UpgradePlanCard />;
  }

  return (
    <CurrentPlanCard
      status={status}
      periodEnd={periodEnd}
      cancelAtPeriodEnd={cancelAtPeriodEnd ?? false}
    />
  );
}
