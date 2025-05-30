"use client";

import {
  Inbox,
  KeyRound,
  LucideIcon,
  Settings2,
  UserRound,
  Vote,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { DesktopDropdownMenu } from "@/core/components/desktop-dropdown-menu";
import { cn } from "@/lib/utils";

export interface Item {
  href: string;
  Icon: LucideIcon;
  label: string;
}

function NavItem({ href, Icon, label }: Item) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Button
      size="sm"
      asChild
      variant="ghost"
      className={cn(
        "group hover:bg-sidebar-accent w-full justify-start gap-2 font-normal",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <Link href={href}>
        <Icon className="opacity-60" />
        {label}
      </Link>
    </Button>
  );
}

export const navItems: Item[] = [
  {
    href: "/",
    Icon: Inbox,
    label: "Feedbacks",
  },
  {
    href: "/votes",
    Icon: Vote,
    label: "Votes",
  },
  {
    href: "/contacts",
    Icon: UserRound,
    label: "Contacts",
  },
  {
    href: "/api-keys",
    Icon: KeyRound,
    label: "API Keys",
  },
  {
    href: "/settings/usage",
    Icon: Settings2,
    label: "Settings",
  },
];

export function Sidebar() {
  return (
    <aside className="border-border bg-sidebar hidden h-screen w-3xs shrink-0 flex-col justify-between border-r p-4 md:flex">
      <div className="flex flex-col gap-8">
        <div className="ml-2 flex h-8 items-center">
          <Link href="/">
            <Logo.Remark height={24} />
          </Link>
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
