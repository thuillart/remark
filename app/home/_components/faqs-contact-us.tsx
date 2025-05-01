"use client";

import Link from "next/link";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/contants";

export function FAQsContactUs() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Button
      asChild
      variant="link"
      className="not-hover:text-muted-foreground"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`mailto:${CONTACT_EMAIL}`}>
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
