"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TermsAgreement() {
  const pathname = usePathname();

  const isSignIn = pathname.includes("sign-in");
  if (isSignIn) return null;

  return (
    <p className="text-center text-muted-foreground text-xs">
      By signing up you agree to our{" "}
      <Button variant="link" asChild className="pr-3 [&_svg]:mt-1 [&_svg]:ml-0">
        <Link href="/terms" target="_blank">
          terms
        </Link>
      </Button>
      .
    </p>
  );
}
