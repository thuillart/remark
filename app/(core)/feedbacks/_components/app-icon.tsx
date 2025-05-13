import { cn } from "@/lib/utils";
import type { ElementType } from "react";

export function AppIcon({
  size,
  Icon,
}: {
  size: "md" | "lg";
  Icon: ElementType;
}) {
  return (
    <div className={cn("size-8 shrink-0", size === "lg" && "size-20")}>
      <div
        className={cn(
          "size-full rounded-lg p-1.25 ring ring-zinc-500/10 ring-inset dark:ring-zinc-400/20",
          size === "lg" && "rounded-2xl p-2 ring-2",
        )}
      >
        <div
          className={cn(
            "flex size-full items-center justify-center rounded bg-zinc-100 text-zinc-600 ring ring-zinc-500/10 ring-inset dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20",
            size === "lg" && "rounded-lg ring-2",
          )}
        >
          <Icon size={size === "lg" ? 44 : 16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
