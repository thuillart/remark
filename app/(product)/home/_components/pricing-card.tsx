"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PricingCard({
  id,
  name,
  price,
  features,
  currentPlan,
  description,
}: {
  id: SubscriptionTier;
  name: string;
  price: number;
  features: { id: string; content: React.ReactNode | string }[];
  description: string;
  currentPlan?: SubscriptionTier;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const planOrder = ["free", "plus", "pro"];
  const isCurrent = id === currentPlan;

  const router = useRouter();

  function handleClick() {
    setIsLoading(true);

    if (currentPlan === "free") {
      // Not subscribed yet, allow checkout for paid plans only
      if (id !== "free") {
        router.push(`/api/auth/checkout/${id}`);
      } else {
        // Free plan, nothing to do or show a message
        setIsLoading(false);
      }
      return;
    }

    // Already subscribed, always go to portal for any plan action
    router.push("/api/auth/portal");
  }

  return (
    <div
      className={cn(
        "flex flex-1 flex-col rounded-2xl border",
        id === "plus" ? "border-ring outline-4 outline-ring/50" : "",
      )}
    >
      <div className="flex flex-col gap-2 p-6">
        <h3 className="font-semibold text-xl tracking-tight">{name}</h3>
        <span className="inline-block whitespace-nowrap">
          <span className="font-semibold text-3xl tracking-tight">
            ${price}
          </span>{" "}
          <span className="-translate-y-px inline-block text-muted-foreground text-sm">
            {id === "pro" && " starts at"} per month
          </span>
        </span>
        <p>{description}</p>
      </div>

      <div className="p-6 pt-0">
        {id === "free" ? (
          <div className="mb-3 h-5" />
        ) : (
          <span className="mb-3 block text-muted-foreground text-sm">
            Everything in {name === "Plus" ? "Free" : "Plus"}, and:
          </span>
        )}
        <ul className="space-y-3">
          {features.map(({ id, content }) => (
            <li
              key={id}
              className="flex items-center gap-x-2 text-pretty text-sm [&_bold]:font-medium"
            >
              <CheckIcon size={16} className="shrink-0" />
              {content}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-6 pt-0">
        <Button
          size="lg"
          loading={isLoading}
          onClick={handleClick}
          variant={id === "plus" ? "default" : "outline"}
          className={cn(
            "group/button h-10 w-full cursor-pointer justify-between rounded-full pr-3 pl-4",
            isLoading && "justify-center",
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isCurrent ? (
            <span className="relative inline-block h-1/2">
              <AnimatePresence mode="wait" initial={false}>
                {!isHovering ? (
                  <motion.span
                    key="current"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 left-0"
                    transition={{ duration: 0.11 }}
                  >
                    Your current plan
                  </motion.span>
                ) : (
                  <motion.span
                    key="manage"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 left-0"
                    transition={{ duration: 0.11 }}
                  >
                    Manage subscription
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          ) : (
            (() => {
              const currentIndex = planOrder.indexOf(currentPlan ?? "free");
              const thisIndex = planOrder.indexOf(id);
              if (thisIndex > currentIndex) {
                return `Upgrade to ${name}`;
              }
              if (thisIndex < currentIndex) {
                return `Downgrade to ${name}`;
              }
              if (id === "free") {
                return "Start Building";
              }
              return `Choose ${name}`;
            })()
          )}
          <CircleArrow
            variant={id === "plus" ? "default" : "outline"}
            direction="up-right"
            isHovering={isHovering}
          />
        </Button>
      </div>
    </div>
  );
}
