import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

function AppIcon({
  variant,
  className,
}: {
  variant?: "icon" | "wordmark";
  className?: string;
}) {
  return (
    <div className="inline-flex h-6 items-center gap-1.5 select-none">
      <span
        className={cn(
          "font-borel h-3.75 text-xl font-medium antialiased select-none",
          className,
        )}
      >
        {variant === "icon" ? (
          <>{APP_NAME.toLowerCase()[0]}</>
        ) : (
          <>{APP_NAME.toLowerCase()}</>
        )}
      </span>
    </div>
  );
}

function AppIconLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex transition-opacity hover:opacity-70", className)}
    >
      <AppIcon />
    </Link>
  );
}

export { AppIcon, AppIconLink };
