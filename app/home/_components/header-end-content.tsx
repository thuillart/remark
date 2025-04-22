"use client";

import Link from "next/link";
import React from "react";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";

export function HeaderEndContent() {
  return (
    <>
      <DesktopMenu />
      <MobileMenu />
    </>
  );
}

function DesktopMenu() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div className="hidden items-center gap-x-6 md:inline-flex">
      <Button
        asChild
        variant="link"
        className="group/button not-hover:text-muted-foreground hover:no-underline"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link href="/login">
          Sign In
          <CircleArrow
            variant="outline"
            direction="up-right"
            isHovering={isHovering}
          />
        </Link>
      </Button>
      <Button size="sm" asChild className="rounded-lg">
        <Link href="/register">Create Account</Link>
      </Button>
    </div>
  );
}

function MobileMenu() {
  return <Button size="icon" className="md:hidden"></Button>;
}
