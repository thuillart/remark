import Link from "next/link";

import { AppIconLink } from "@/components/app-icon";
import { Logo } from "@/components/logo";
import {
  DISCORD_URL,
  GITHUB_URL,
  SUPPORT_EMAIL,
  X_URL,
  YOUTUBE_URL,
} from "@/lib/constants";
import { FooterArtwork } from "@/public/components/footer-artwork";

export function Footer() {
  return (
    <footer className="relative mt-12 pt-24 pb-12">
      <FooterArtwork />
      <div className="container">
        <div className="flex flex-wrap justify-between gap-x-24 gap-y-12">
          <AppIconLink />
          <FooterMenu />
        </div>
        <div className="mt-16 flex flex-wrap-reverse items-center justify-between gap-x-12 gap-y-6">
          <FooterCopyright />
          <FooterSocial />
        </div>
      </div>
    </footer>
  );
}

function FooterMenu() {
  return (
    <ul className="flex flex-wrap gap-x-24 gap-y-12">
      {menuItems.map(({ label, items }) => (
        <li key={label}>
          <h3 className="text-sm font-medium">{label}</h3>
          <ul>
            {items.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="not-hover:text-muted-foreground mt-4 block text-sm transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function FooterCopyright() {
  return (
    <p className="text-muted-foreground text-sm">
      &copy; {new Date().getFullYear()} All rights reserved.
    </p>
  );
}

function FooterSocial() {
  return (
    <ul className="flex items-center gap-x-6">
      {socialItems.map(({ label, href, Icon }) => (
        <li key={label}>
          <Link
            href={href}
            className="group text-muted-foreground transition-colors"
          >
            <span className="sr-only">{label}</span>
            <Icon
              size={18}
              className="group-[:not(:hover)]:*:first:fill-muted-foreground"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

const menuItems = [
  {
    label: "Developers",
    items: [
      {
        label: "Documentation",
        href: "/docs",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        label: "News",
        href: "/news",
      },
      {
        label: "Q&A",
        href: "/home#faqs",
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        label: "Contact",
        href: `mailto:${SUPPORT_EMAIL}`,
      },
      {
        label: "Notice",
        href: "/notice",
      },
      {
        label: "Terms",
        href: "/terms",
      },
    ],
  },
];

const socialItems = [
  {
    label: "X",
    href: X_URL,
    Icon: Logo.X,
  },
  {
    label: "GitHub",
    href: GITHUB_URL,
    Icon: Logo.GitHub,
  },
  {
    label: "Discord",
    href: DISCORD_URL,
    Icon: Logo.Discord,
  },
  {
    label: "YouTube",
    href: YOUTUBE_URL,
    Icon: Logo.YouTube,
  },
];
