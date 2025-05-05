"use client";

import {
  GalleryVerticalIcon,
  InboxIcon,
  KeyRoundIcon,
  type LucideIcon,
  SlidersHorizontalIcon,
  WalletCardsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import type { IconName, Item } from "@/core/components/sidebar";
import { cn } from "@/lib/utils";

const iconMap: Record<IconName, LucideIcon> = {
  InboxIcon,
  WalletCardsIcon,
  GalleryVerticalIcon,
  KeyRoundIcon,
  SlidersHorizontalIcon,
};

export function NavItem({ href, iconName, label }: Omit<Item, "Icon">) {
  const Icon: LucideIcon = iconMap[iconName];
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
        <Icon
          size={16}
          className={cn("opacity-80", isHovering && "opacity-100")}
        />
        {label}
      </Link>
    </Button>
  );
}
