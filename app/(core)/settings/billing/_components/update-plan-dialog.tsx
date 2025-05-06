"use client";

import { CheckIcon, RefreshCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import type { SubscriptionTier } from "@/lib/types";

type Plan = {
  value: SubscriptionTier;
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
  currentPlan,
}: { currentPlan: SubscriptionTier }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(currentPlan);
  const router = useRouter();

  async function onUpgrade(plan: SubscriptionTier) {
    setIsLoading(true);

    // Redirect to Polar checkout
    router.push(`/checkout/${plan}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 shadow-sm active:shadow-none">
          Change plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
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
            className="-space-y-px gap-0 rounded-lg shadow-black/5 shadow-xs"
            defaultValue={currentPlan}
            onValueChange={(v) => setSelectedPlan(v as SubscriptionTier)}
          >
            {plans.map((plan) => (
              <div
                key={plan.value}
                className="relative flex h-14 flex-col justify-center gap-4 border border-input p-4 first:rounded-t-lg last:rounded-b-lg has-[[data-state=checked]]:z-10 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent"
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
              <strong className="font-medium text-sm">Features include:</strong>
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Create unlimited projects.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Remove watermarks.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Add unlimited users and free viewers.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Upload unlimited files.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                7-day money back guarantee.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Advanced permissions.
              </li>
            </ul>
          </div>

          <div className="grid gap-2">
            <Button
              type="button"
              onClick={() => onUpgrade(selectedPlan)}
              disabled={currentPlan === selectedPlan}
              className="w-full"
            >
              {currentPlan === selectedPlan
                ? "Your current plan"
                : "Change plan"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                loading={isLoading}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
