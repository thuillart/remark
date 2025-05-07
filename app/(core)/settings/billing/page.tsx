import "server-only";

import type { CustomerState } from "@polar-sh/sdk/dist/commonjs/models/components/customerstate";
import { Loader2Icon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

import { CurrentPlanCard } from "@/billing/components/current-plan-card";
import { ResolveSubscriptionButton } from "@/billing/components/resolve-subscription-button";
import { UpdatePlanDialog } from "@/billing/components/update-plan-dialog";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/core/components/empty-state";
import { getSlugFromProductId } from "@/lib/configs/products";
import { getBaseUrl } from "@/lib/utils";

export default async function BillingPage() {
  return (
    <div className="container">
      <Suspense
        fallback={
          <div className="flex h-72 items-center justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        }
      >
        <BillingCard />
      </Suspense>
    </div>
  );
}

async function BillingCard() {
  const response = await fetch(`${getBaseUrl()}/api/auth/state`, {
    headers: await headers(),
  });

  const state = (await response.json()) as CustomerState;

  const subscription = state.activeSubscriptions.find(
    (subscription) => subscription.status === "active",
  );

  if (!subscription) {
    return (
      <EmptyState
        icons={[SparklesIcon, SparklesIcon, SparklesIcon]}
        title="You're not subscribed to any plan yet"
        action={<UpdatePlanDialog currentPlan="free" />}
        description="Upgrade for AI at your fingertips, no daily limit and many more."
      />
    );
  }

  return (
    <>
      {subscription.status !== "active" && (
        <Alert
          icon={
            <TriangleAlertIcon
              size={16}
              className="opacity-80"
              strokeWidth={2}
            />
          }
          action={<ResolveSubscriptionButton />}
          layout="row"
          variant="warning"
        >
          <p className="text-sm">Your subscription isn't active.</p>
        </Alert>
      )}

      <CurrentPlanCard
        plan={getSlugFromProductId(subscription.productId)}
        status={subscription.status}
        periodEnd={subscription.endsAt}
        cancelAtPeriodEnd={subscription.cancelAtPeriodEnd ?? false}
      />
    </>
  );
}
