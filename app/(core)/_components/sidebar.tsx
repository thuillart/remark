"use client";

import {
  type RemixiconComponentType,
  RiContactsBook2Line,
  RiEqualizer3Line,
  RiInbox2Line,
  RiKey2Line,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { LogoLink } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { DesktopDropdownMenu } from "@/core/components/desktop-dropdown-menu";
import { cn } from "@/lib/utils";

function NavItem({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: RemixiconComponentType;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Button
      size="sm"
      asChild
      variant="ghost"
      className={cn(
        "group w-full justify-start gap-2 font-normal hover:bg-accent",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      <Link href={href}>
        <Icon className="opacity-60" />
        {label}
      </Link>
    </Button>
  );
}

export interface Item {
  href: string;
  Icon: RemixiconComponentType;
  label: string;
}

export const navItems: Item[] = [
  {
    href: "/",
    Icon: RiInbox2Line,
    label: "Feedbacks",
  },
  {
    href: "/contacts",
    Icon: RiContactsBook2Line,
    label: "Contacts",
  },
  {
    href: "/api-keys",
    Icon: RiKey2Line,
    label: "API Keys",
  },
  {
    href: "/settings/usage",
    Icon: RiEqualizer3Line,
    label: "Settings",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-3xs shrink-0 flex-col justify-between border-border border-r bg-background p-4 md:flex">
      <div className="flex flex-col gap-8">
        <div className="ml-2.5 flex h-8 items-center">
          <LogoLink />
        </div>

        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavItem href={item.href} Icon={item.Icon} label={item.label} />
            </li>
          ))}
        </ul>
      </div>

      <DesktopDropdownMenu />
    </aside>
  );
}
