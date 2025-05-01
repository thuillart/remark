import "server-only";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeaderStartContent() {
  return (
    <>
      <hr className="h-4 w-px bg-border max-sm:hidden" />

      <Button
        asChild
        variant="link"
        className="inline-flex font-normal text-muted-foreground hover:text-foreground hover:no-underline max-sm:hidden"
      >
        <Link href="/docs">Documentation</Link>
      </Button>
    </>
  );
}
