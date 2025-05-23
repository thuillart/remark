import { useId } from "react";

import { cn } from "@/lib/utils";

interface DotPatternProps {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: unknown;
}

export function DotPattern({
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  width = 16,
  height = 16,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      className={cn(
        "fill-muted-foreground/50 pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          x={x}
          y={y}
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}
