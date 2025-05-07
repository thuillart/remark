import Link from "next/link";
import React from "react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("h-3 font-borel text-xl antialiased", className)}>
      {APP_NAME.toLowerCase()}
    </span>
  );
}

function LogoLink({
  className,
}: {
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("flex transition-opacity hover:opacity-70", className)}
    >
      <Logo />
    </Link>
  );
}

export { Logo, LogoLink };
