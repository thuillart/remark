import "server-only";

import { LogoLink } from "@/components/logo";
import { ContactIcon } from "@/core/components/icons/contact";
import { NavItem } from "@/core/components/nav-item";

export interface Item {
  href: string;
  Icon: React.ComponentType<{ className?: string; isHovering?: boolean }>;
  label: string;
}

export const navItems: Item[] = [
  {
    href: "/",
    Icon: ContactIcon,
    label: "Feedbacks",
  },
  {
    href: "/contacts",
    Icon: ContactIcon,
    label: "Contacts",
  },
  {
    href: "/api-keys",
    Icon: ContactIcon,
    label: "API Keys",
  },
  {
    href: "/settings/usage",
    Icon: ContactIcon,
    label: "Usage",
  },
  {
    href: "/settings/billing",
    Icon: ContactIcon,
    label: "Billing",
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

      {/* Desktop dropdown */}
    </aside>
  );
}
