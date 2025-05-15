"use client";

import Link from "next/link";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";

export function FeaturesButton() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Button
      size="sm"
      asChild
      variant="outline"
      className="group/button shrink-0 self-start rounded-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        href="https://bundlephobia.com/package/@remark-sh/sdk"
        target="_blank"
      >
        Check it out
        <CircleArrow
          variant="outline"
          direction="up-right"
          isHovering={isHovering}
        />
      </Link>
    </Button>
  );
}
