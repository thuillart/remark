import "server-only";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <div className="flex h-16 items-center justify-end border-border border-b px-6">
      <div className="hidden items-center gap-6 md:flex">
        <Button
          size="sm"
          asChild
          variant="link"
          className="text-muted-foreground hover:text-foreground hover:no-underline"
        >
          <Link href="/docs" target="_blank">
            Documentation
          </Link>
        </Button>
      </div>
    </div>
  );
}
