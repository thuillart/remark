import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function PageIcon({
  size,
  Icon,
}: {
  size: "md" | "lg";
  Icon: LucideIcon;
}) {
  return (
    <>
      <div
        className={cn(
          "bg-primary/2.5 shrink-0 border",
          size === "lg"
            ? "size-20 rounded-2xl p-1.5"
            : "size-8 rounded-lg p-0.5",
        )}
      >
        <div
          className={cn(
            "bg-background flex size-full items-center justify-center border",
            size === "lg" ? "rounded-xl" : "rounded-md",
          )}
        >
          <Icon size={size === "lg" ? 40 : 14} className="opacity-80" />
        </div>
      </div>
    </>
  );
}
