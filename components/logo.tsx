import Link from "next/link";
import React from "react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Logo({
  variant,
  className,
}: {
  variant?: "icon" | "wordmark";
  className?: string;
}) {
  return (
    <span className={cn("h-3 font-borel text-xl antialiased", className)}>
      {variant === "icon" ? APP_NAME.toLowerCase()[0] : APP_NAME.toLowerCase()}
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
