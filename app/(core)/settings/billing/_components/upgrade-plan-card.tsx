"use client";

import { BadgeAlertIcon, SparklesIcon, Wand2Icon } from "lucide-react";
import React from "react";

import { EmptyState } from "@/core/components/empty-state";
import { authClient } from "@/lib/auth-client";

export function UpgradePlanCard() {
  const [isLoading, setIsLoading] = React.useState(false);

  async function onUpgrade() {
    setIsLoading(true);

    const { error } = await authClient.subscription.upgrade({
      plan: "plus",
      cancelUrl: "/billing",
      successUrl: "/billing",
    });
  }

  return (
    <EmptyState
      title="You're not subscribed to any plan yet"
      icons={[SparklesIcon, Wand2Icon, SparklesIcon]}
      description="Upgrade for AI at your fingertips, no daily limit and many more."
      action={{ label: "Upgrade", loading, onClick: onUpgrade }}
    />
  );
}
