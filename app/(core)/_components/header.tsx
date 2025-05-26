import Link from "next/link";

import { FeedbackPopover } from "@/core/components/feedback-popover";

export function Header() {
  return (
    <div className="border-border flex h-16 items-center justify-end border-b px-6">
      <div className="hidden items-center gap-6 md:flex">
        <FeedbackPopover />
        <Link
          href="/docs"
          target="_blank"
          className="text-muted-foreground hover:text-foreground rounded-md text-sm hover:no-underline"
        >
          Documentation
        </Link>
      </div>
    </div>
  );
}
