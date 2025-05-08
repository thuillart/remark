"use client";

import Link from "next/link";
import React from "react";

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
  features: { id: string; content: React.ReactNode | string }[];
  description: string;
}) {
  const [isHovering, setIsHovering] = React.useState(false);

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
          asChild
          variant={id === "pro" ? "outline" : "default"}
          className="group/button h-10 w-full justify-between rounded-full pr-3 pl-4"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Link href="/settings/billing">
            {id === "free" ? "Start Building" : `Upgrade to ${name}`}
            <CircleArrow
              variant={id === "pro" ? "outline" : "default"}
              direction="up-right"
              isHovering={isHovering}
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}
