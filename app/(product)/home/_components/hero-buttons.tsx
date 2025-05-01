"use client";

import Link from "next/link";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";

export function HeroButtons() {
  const [isHovered1, setIsHovered1] = React.useState(false);
  const [isHovered2, setIsHovered2] = React.useState(false);

  return (
    <div className="flex gap-4 max-[425px]:flex-col">
      <Button
        asChild
        variant="outline"
        className="group/button h-11 rounded-xl px-6 text-base"
        onMouseEnter={() => setIsHovered1(true)}
        onMouseLeave={() => setIsHovered1(false)}
      >
        <Link href="/docs">
          Documentation
          <CircleArrow
            variant="outline"
            direction="up-right"
            isHovering={isHovered1}
          />
        </Link>
      </Button>

      <Button
        asChild
        variant="default"
        className="group/button h-11 rounded-xl px-6 text-base"
        onMouseEnter={() => setIsHovered2(true)}
        onMouseLeave={() => setIsHovered2(false)}
      >
        <Link href="/sign-up">
          Start Building
          <CircleArrow
            variant="default"
            direction="up-right"
            isHovering={isHovered2}
          />
        </Link>
      </Button>
    </div>
  );
}
