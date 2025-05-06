"use client";

import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";

export function ResolveSubscriptionButton() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Button
      variant="link"
      className="cursor-pointer gap-1.5 whitespace-nowrap font-medium text-current text-sm not-hover:opacity-80"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      Add payment method
      <CircleArrow
        variant="outline"
        direction="up-right"
        isHovering={isHovering}
        className="[&_path]:stroke-amber-600/45 group-hover/button:[&_path]:stroke-amber-600/90 [&_rect]:fill-amber-600/4.5 group-hover/button:[&_rect]:fill-amber-600/9"
      />
    </Button>
  );
}
