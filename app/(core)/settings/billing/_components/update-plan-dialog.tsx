"use client";

import { CheckIcon, RefreshCcwIcon } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";
import type { SubscriptionSlug } from "@/lib/schema";

type Plan = {
  value: SubscriptionSlug;
  label: string;
  price: string;
};

const plans: Plan[] = [
  {
    value: "free",
    label: "Free",
    price: "$0/mo",
  },
  {
    value: "plus",
    label: "Plus",
    price: "$20/mo",
  },
  {
    value: "pro",
    label: "Pro",
    price: "$200/mo",
  },
];

export function UpdatePlanDialog({
  children,
  currentPlan,
}: {
  children: React.ReactNode;
  currentPlan: SubscriptionSlug;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(currentPlan);

  async function onUpgrade(slug: SubscriptionSlug) {
    setIsLoading(true);
    await authClient.checkout({ slug });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col gap-2">
          <div
            className="border-border flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <RefreshCcwIcon className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Change your plan</DialogTitle>
            <DialogDescription className="text-left">
              Pick one of the following plans.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <RadioGroup
            className="gap-0 -space-y-px rounded-lg shadow-xs shadow-black/5"
            defaultValue={currentPlan}
            onValueChange={(v) => setSelectedPlan(v as SubscriptionSlug)}
          >
            {plans.map((plan) => (
              <div
                key={plan.value}
                className="border-input has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent relative flex h-14 flex-col justify-center gap-4 border p-4 first:rounded-t-lg last:rounded-b-lg has-[[data-state=checked]]:z-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      id={plan.value}
                      value={plan.value}
                      className="after:absolute after:inset-0"
                      aria-describedby={`${plan.value}-price`}
                    />
                    <Label
                      htmlFor={plan.value}
                      className="inline-flex items-center"
                    >
                      {plan.label}
                      {plan.value === "plus" && (
                        <Badge className="ms-2 rounded-full">Popular</Badge>
                      )}
                    </Label>
                  </div>
                  <div className="text-muted-foreground text-xs leading-[inherit]">
                    {plan.price}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-3">
            <p>
              <strong className="text-sm font-medium">Features include:</strong>
            </p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="text-primary mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Create unlimited projects.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="text-primary mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Remove watermarks.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="text-primary mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Add unlimited users and free viewers.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="text-primary mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Upload unlimited files.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="text-primary mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                7-day money back guarantee.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="text-primary mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Advanced permissions.
              </li>
            </ul>
          </div>

          <div className="grid gap-2">
            <Button
              type="button"
              loading={isLoading}
              onClick={() => onUpgrade(selectedPlan)}
              disabled={currentPlan === selectedPlan}
              className="w-full"
            >
              {currentPlan === selectedPlan
                ? "Your current plan"
                : "Change plan"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
