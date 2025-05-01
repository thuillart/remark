"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import type { Item } from "@/core/components/sidebar";
import { cn } from "@/lib/utils";

export function NavItem({ href, Icon, label }: Item) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Button
      size="sm"
      asChild
      variant="ghost"
      className={cn(
        "group w-full justify-start gap-2 font-normal hover:bg-accent",
        isActive && "bg-accent text-accent-foreground",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={href}>
        <Icon className="not-group-hover:opacity-80" isHovering={isHovering} />
        {label}
      </Link>
    </Button>
  );
}
