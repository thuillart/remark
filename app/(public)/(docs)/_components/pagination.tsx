"use client";

import { CircleArrow } from "@/components/circle-arrow";
import Link from "next/link";
import React from "react";

function PaginationNext({ href, label }: { href: string; label: string }) {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Link
      href={href}
      className="group/button block w-full select-none flex-col rounded-lg bg-background px-5 py-4 text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.02)] transition-[100ms] hover:bg-foreground/2.5 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_1px_2px_rgba(255,255,255,0.02)] dark:hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_2px_6px_rgba(255,255,255,0.03)]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col items-end gap-1">
        <div className="inline-flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">Next</span>
          <CircleArrow
            variant="outline"
            direction="right"
            isHovering={isHovering}
          />
        </div>
        <div className="text-sm">{label}</div>
      </div>
    </Link>
  );
}

function PaginationPrevious({ href, label }: { href: string; label: string }) {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Link
      href={href}
      className="group/button block w-full select-none flex-col rounded-lg bg-background px-5 py-4 text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.02)] transition-[100ms] hover:bg-foreground/2.5 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_1px_2px_rgba(255,255,255,0.02)] dark:hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_2px_6px_rgba(255,255,255,0.03)]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-1 text-muted-foreground">
          <CircleArrow
            variant="outline"
            direction="left"
            isHovering={isHovering}
          />
          <span className="text-xs">Previous</span>
        </div>
        <div className="text-sm">{label}</div>
      </div>
    </Link>
  );
}

function PaginationGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-6">{children}</div>;
}

export { PaginationGroup, PaginationNext, PaginationPrevious };
