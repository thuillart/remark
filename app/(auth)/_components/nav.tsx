"use client";

import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Nav() {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  const [isHovering, setIsHovering] = React.useState<"left" | "right" | null>(
    null,
  );

  return (
    <>
      <Button
        asChild
        variant="ghost"
        className="absolute top-4 left-4 rounded-full text-muted-foreground"
        onMouseEnter={() => setIsHovering("left")}
        onMouseLeave={() => setIsHovering(null)}
      >
        <Link href="/home">
          <CircleArrow
            variant="outline"
            direction="left"
            isHovering={isHovering === "left"}
          />
          Home
        </Link>
      </Button>

      <Button
        asChild
        variant="ghost"
        className="absolute top-4 right-4 rounded-full text-muted-foreground"
        onMouseEnter={() => setIsHovering("right")}
        onMouseLeave={() => setIsHovering(null)}
      >
        <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
          Sign {isSignIn ? "Up" : "In"}
          <CircleArrow
            variant="outline"
            direction="right"
            isHovering={isHovering === "right"}
          />
        </Link>
      </Button>
    </>
  );
}
