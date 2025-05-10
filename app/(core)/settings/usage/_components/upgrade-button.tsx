"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { UpdatePlanDialog } from "@/billing/components/update-plan-dialog";
import { Button } from "@/components/ui/button";
import type { SubscriptionSlug } from "@/lib/schema";

export function UpgradeButton({ slug }: { slug: SubscriptionSlug }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  if (slug === "free") {
    return (
      <UpdatePlanDialog currentPlan="free">
        <Button size="sm">Upgrade</Button>
      </UpdatePlanDialog>
    );
  }

  async function handleClick() {
    setIsLoading(true);
    router.push("/api/auth/portal");
  }

  return (
    <Button size="sm" onClick={handleClick} loading={isLoading}>
      Upgrade
    </Button>
  );
}
