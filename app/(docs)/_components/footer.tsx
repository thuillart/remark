import {
  RiDiscordFill,
  RiGithubFill,
  RiTwitterXLine,
  RiYoutubeFill,
} from "@remixicon/react";
import Link from "next/link";

import { DISCORD_URL, GITHUB_URL, X_URL, YOUTUBE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-12 flex border-t pt-10 pb-28">
      <div className="flex gap-6">
        {socials.map(({ name, href, Icon }) => (
          <Link
            key={name}
            href={href}
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon size={20} />
          </Link>
        ))}
      </div>
    </footer>
  );
}

const socials = [
  {
    name: "X",
    href: X_URL,
    Icon: RiTwitterXLine,
  },
  {
    name: "GitHub",
    href: GITHUB_URL,
    Icon: RiGithubFill,
  },
  {
    name: "Discord",
    href: DISCORD_URL,
    Icon: RiDiscordFill,
  },
  {
    name: "YouTube",
    href: YOUTUBE_URL,
    Icon: RiYoutubeFill,
  },
];
