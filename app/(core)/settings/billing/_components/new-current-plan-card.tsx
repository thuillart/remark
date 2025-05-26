"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { TextShimmer } from "@/components/text-shimmer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { APP_NAME } from "@/lib/constants";
import { SubscriptionSlug } from "@/lib/schema";
import { capitalizeFirstLetter } from "@/lib/utils";

export function NewCurrentPlanCard({
  slug,
  startedAt,
  currentPeriodEnd,
}: {
  slug: SubscriptionSlug;
  startedAt: Date;
  currentPeriodEnd: Date;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  async function handlePortal() {
    setIsLoading(true);
    await authClient.customer.portal();
  }

  return (
    <Card className="gap-4 py-5">
      <CardHeader>
        <CardTitle className="flex justify-between text-lg">
          <TextShimmer>
            {`${APP_NAME} ${capitalizeFirstLetter(slug)}`}
          </TextShimmer>
          <Badge variant="outline" className="justify-self-end rounded-full">
            Joined on {format(startedAt, "d MMM yyyy")}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar size={16} className="opacity-80" />
          Next payment on {format(currentPeriodEnd, "d MMMM yyyy")}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <hr className="border-t border-dashed" />
        <div></div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={handlePortal} loading={isLoading}>
          Manage subscription
        </Button>

        <Button
          onClick={handlePortal}
          variant="link"
          className="group not-hover:text-destructive/80 text-destructive"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Cancel plan
          <CircleArrow
            variant="destructive"
            direction="up-right"
            isHovering={isHovering}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
