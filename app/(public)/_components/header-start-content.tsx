"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderStartContent() {
  const pathname = usePathname();

  if (pathname.startsWith("/docs")) {
    return (
      <>
        <hr className="bg-border h-4 w-px max-sm:hidden" />
        <Link
          href="/docs"
          className={buttonVariants({
            variant: "link",
            className:
              "text-muted-foreground hover:text-foreground inline-flex font-normal hover:no-underline max-sm:hidden",
          })}
        >
          Documentation
        </Link>
      </>
    );
  }

  return null;
}
