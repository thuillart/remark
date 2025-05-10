"use client";

import Link from "next/link";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/lib/constants";

export function FAQsContactUs() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Button
      asChild
      variant="link"
      className="not-hover:text-muted-foreground text-base"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`mailto:${SUPPORT_EMAIL}`}>
        Contact us
        <CircleArrow
          variant="outline"
          direction="up-right"
          isHovering={isHovering}
        />
      </Link>
    </Button>
  );
}
