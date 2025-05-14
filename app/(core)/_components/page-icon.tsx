import { cn } from "@/lib/utils";
import { RemixiconComponentType } from "@remixicon/react";

export function PageIcon({
  size,
  Icon,
}: {
  size: "md" | "lg";
  Icon: RemixiconComponentType;
}) {
  return (
    <div
      className={cn(
        "border-input bg-background inline-flex size-8 shrink-0 items-center justify-center rounded-lg border whitespace-nowrap shadow-sm shadow-black/5 transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
        size === "lg" &&
          "size-20 rounded-[20px] border-2 shadow-md shadow-black/5",
      )}
    >
      <Icon size={size === "lg" ? 40 : 16} strokeWidth={2} />
    </div>
  );
}
