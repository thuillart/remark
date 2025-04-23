"use client";

import { useState } from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export function PricingCard({
  id,
  name,
  price,
  features,
  description,
}: {
  id: "free" | "plus" | "pro";
  name: string;
  price: number;
  features: (React.ReactNode | string)[];
  description: string;
}) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-1 flex-col rounded-2xl border",
        id === "plus" ? "outline-ring/50 border-ring outline-4" : "",
      )}
    >
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
        <span className="inline-block whitespace-nowrap">
          <span className="text-3xl font-semibold tracking-tight">
            ${price}
          </span>{" "}
          <span className="text-muted-foreground inline-block -translate-y-px text-sm">
            {id === "pro" && " starts at"} per month
          </span>
        </span>
        <p>{description}</p>
      </div>

      <div className="p-6 pt-0">
        {id === "free" ? (
          <div className="mb-3 h-5" />
        ) : (
          <span className="text-muted-foreground mb-3 block text-sm">
            Everything in {name === "Plus" ? "Free" : "Plus"}, and:
          </span>
        )}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-x-2 text-sm text-pretty [&_bold]:font-medium"
            >
              <CheckIcon size={16} className="shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-6 pt-0">
        <Button
          size="lg"
          className="group/button h-10 w-full justify-between rounded-full pr-3 pl-4"
          variant={id === "pro" ? "outline" : "default"}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {id === "free" ? "Start Building" : "Upgrade to " + name}
          <CircleArrow
            variant={id === "pro" ? "outline" : "default"}
            direction="up-right"
            isHovering={isHovering}
          />
        </Button>
      </div>
    </div>
  );
}
