"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";

export function Terms() {
  const pathname = usePathname();
  const isSignIn = pathname.includes("sign-in");
  if (isSignIn) return null;

  return (
    <p className="text-center text-muted-foreground text-xs">
      By signing up you agree to our{" "}
      <Button asChild variant="link" className="text-xs">
        <Link href="/terms" target="_blank">
          terms
        </Link>
      </Button>
      .
    </p>
  );
}
