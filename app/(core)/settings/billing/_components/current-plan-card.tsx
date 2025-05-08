"use client";

import { differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

import { GlowEffect } from "@/components/glow-effect";
import { TextShimmer } from "@/components/text-shimmer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { SubscriptionTier } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";

export function CurrentPlanCard({
  plan,
  periodEnd,
  cancelAtPeriodEnd,
}: {
  plan: SubscriptionTier;
  status: string;
  periodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  async function onPortal() {
    setIsLoading(true);
    router.push("/api/auth/portal");
  }

  return (
    <Card className="relative">
      <GlowEffect borderWidth={2} />

      <CardHeader>
        <CardTitle className="flex items-center gap-2">Current plan</CardTitle>
        <CardDescription>
          {!cancelAtPeriodEnd ? (
            <>
              Thanks for being a{" "}
              <TextShimmer>
                {`${APP_NAME} ${capitalizeFirstLetter(plan)}`}
              </TextShimmer>{" "}
              member.
            </>
          ) : cancelAtPeriodEnd ? (
            <>
              Your{" "}
              <TextShimmer>
                {`${APP_NAME} ${capitalizeFirstLetter(plan)}`}
              </TextShimmer>{" "}
              plan will end in {differenceInDays(periodEnd, new Date())} days.
            </>
          ) : null}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button
          variant="outline"
          onClick={onPortal}
          loading={isLoading}
          className="relative"
        >
          {!cancelAtPeriodEnd ? (
            "Manage subscription"
          ) : (
            <>
              <GlowEffect borderWidth={2} />
              I've changed my mind
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
