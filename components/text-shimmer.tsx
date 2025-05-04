"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

function ShimmerComponent({
  as: Component = "p",
  children,
  className,
  spread = 2,
  duration = 2,
}: {
  as?: React.ElementType;
  spread?: number;
  children: string;
  duration?: number;
  className?: string;
}) {
  const MotionComponent = motion.create(
    Component as keyof React.JSX.IntrinsicElements,
  );

  const dynamicSpread = React.useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%] bg-clip-text bg-no-repeat text-transparent [--base-color:var(--color-muted-foreground)] [--bg:linear-gradient(90deg,transparent_calc(50%-var(--spread)),var(--gradient-color),transparent_calc(50%+var(--spread)))] [--gradient-color:var(--color-foreground)] [background-image:var(--bg),linear-gradient(var(--base-color),var(--base-color))]",
        className,
      )}
      initial={{
        backgroundPosition: "100% center",
      }}
      animate={{
        backgroundPosition: "0% center",
      }}
      transition={{
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        duration,
      }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

export const TextShimmer = React.memo(ShimmerComponent);
