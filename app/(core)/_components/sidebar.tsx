import "server-only";

import { LogoLink } from "@/components/logo";
import { DesktopDropdownMenu } from "@/core/components/desktop-dropdown-menu";
import { NavItem } from "@/core/components/nav-item";

export type IconName =
  | "InboxIcon"
  | "WalletCardsIcon"
  | "GalleryVerticalIcon"
  | "KeyRoundIcon"
  | "SlidersHorizontalIcon";

export interface Item {
  href: string;
  iconName: IconName;
  label: string;
}

export const navItems: Item[] = [
  {
    href: "/",
    label: "Feedbacks",
    iconName: "InboxIcon",
  },
  {
    href: "/contacts",
    label: "Contacts",
    iconName: "WalletCardsIcon",
  },
  {
    href: "/logs",
    label: "Logs",
    iconName: "GalleryVerticalIcon",
  },
  {
    href: "/api-keys",
    label: "API Keys",
    iconName: "KeyRoundIcon",
  },
  {
    href: "/settings/usage",
    label: "Settings",
    iconName: "SlidersHorizontalIcon",
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
              <NavItem
                href={item.href}
                iconName={item.iconName}
                label={item.label}
              />
            </li>
          ))}
        </ul>
      </div>

      <DesktopDropdownMenu />
    </aside>
  );
}
