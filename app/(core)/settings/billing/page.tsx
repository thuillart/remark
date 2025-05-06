import "server-only";

import { getSubscription } from "@/actions/get-subscription";
import { Loader2Icon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import { Suspense } from "react";

import { CurrentPlanCard } from "@/billing/components/current-plan-card";
import { ResolveSubscriptionButton } from "@/billing/components/resolve-subscription-button";
import { UpdatePlanDialog } from "@/billing/components/update-plan-dialog";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/core/components/empty-state";

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
  const result = await getSubscription({});

  // const plan = result.data.subscription.plan;
  // const status = result.data.subscription.status;
  // const periodEnd = result.data.subscription.periodEnd;
  // const cancelAtPeriodEnd = result.data.subscription.cancelAtPeriodEnd;

  // console.log(plan);

  // if (plan === "free") {
  //   return (
  //     <EmptyState
  //       title="You're not subscribed to any plan yet"
  //       icons={[SparklesIcon, SparklesIcon, SparklesIcon]}
  //       action={<UpdatePlanDialog currentPlan="free" />}
  //       description="Upgrade for AI at your fingertips, no daily limit and many more."
  //     />
  //   );
  // }

  return (
    <>
      {/* {status !== "active" && status !== "trialing" && (
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
        status={status}
        periodEnd={periodEnd}
        cancelAtPeriodEnd={cancelAtPeriodEnd ?? false}
      /> */}
    </>
  );
}
