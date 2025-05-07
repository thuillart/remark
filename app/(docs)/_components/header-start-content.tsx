import "server-only";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function HeaderStartContent() {
  return (
    <>
      <hr className="h-4 w-px bg-border max-sm:hidden" />
      <Link
        href="/docs"
        className={buttonVariants({
          variant: "link",
          className:
            "inline-flex font-normal text-muted-foreground hover:text-foreground hover:no-underline max-sm:hidden",
        })}
      >
        Documentation
      </Link>
    </>
  );
}
