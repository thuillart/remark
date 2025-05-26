import { RiAlertLine } from "@remixicon/react";
import { Suspense } from "react";

import { ResolveSubscriptionButton } from "@/billing/components/resolve-subscription-button";
import { UpdatePlanDialog } from "@/billing/components/update-plan-dialog";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/core/components/empty-state";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/configs/polar";
import { getSlugFromProductId } from "@/lib/configs/products";
import { CreditCard } from "lucide-react";
import { headers } from "next/headers";
import { NewCurrentPlanCard } from "./_components/new-current-plan-card";

export default function BillingPage() {
  return (
    <div className="container">
      <Suspense fallback={<Skeleton className="h-38 rounded-xl border" />}>
        <BillingCard />
      </Suspense>
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

  // TO be able to get the payment method, we retrieve the checkout session
  const checkoutSession = await polarClient.checkouts.list({
    query: user.email,
    productId: subscription.productId,
    customerId: customerState?.id,
  });

  console.log(checkoutSession.result);

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

      <NewCurrentPlanCard
        slug={getSlugFromProductId(subscription.productId)}
        startedAt={subscription.startedAt}
        currentPeriodEnd={subscription.currentPeriodEnd}
      />
    </>
  );
}
