import "server-only";

import Link from "next/link";

import { FeedbackPopover } from "@/core/components/feedback-popover";

export function Header() {
  return (
    <div className="flex h-16 items-center justify-end border-border border-b px-6">
      <div className="hidden items-center gap-6 md:flex">
        <FeedbackPopover />
        <Link
          href="/docs"
          target="_blank"
          className="rounded-md text-muted-foreground text-sm hover:text-foreground hover:no-underline"
        >
          Documentation
        </Link>
      </div>
    </div>
  );
}
