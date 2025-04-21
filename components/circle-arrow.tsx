"use client";

import { cva, VariantProps } from "class-variance-authority";
import { motion, useAnimate } from "framer-motion";
import React from "react";

interface CircleArrowProps extends VariantProps<typeof circleArrowVariants> {
  direction: "right" | "left" | "up-right" | "up-left";
  isHovering: boolean;
}

export function CircleArrow({
  variant,
  direction,
  isHovering,
}: CircleArrowProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();

  React.useEffect(() => {
    if (isHovering && !isAnimating) {
      setIsAnimating(true);
      Promise.all([
        animate1(scope1.current, {
          translateX:
            direction === "right"
              ? [0, 20]
              : direction === "left"
                ? [-20, 0]
                : direction === "up-right"
                  ? [0, 20]
                  : [-20, 0],
        }),
        animate2(scope2.current, {
          translateX:
            direction === "right"
              ? [-20, 0]
              : direction === "left"
                ? [0, 20]
                : direction === "up-right"
                  ? [-20, 0]
                  : [0, 20],
        }),
      ]).finally(() => {
        setIsAnimating(false);
      });
    }
  }, [isHovering]);

  return (
    <svg
      fill="none"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 0 16 16"
      className={circleArrowVariants({ variant })}
    >
      <rect rx={8} width={16} height={16} />
      <motion.path
        d="M4.75 8L11.25 8M11.25 8L8.75 5.5M11.25 8L8.75 10.5"
        ref={scope1}
        style={{ transformOrigin: "8px 8px" }}
        stroke="var(--muted-foreground)"
        className={direction === "up-right" ? "-rotate-45" : ""}
        strokeWidth={1.5}
        strokeOpacity={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M4.75 8L11.25 8M11.25 8L8.75 5.5M11.25 8L8.75 10.5"
        ref={scope2}
        style={{ transformOrigin: "8px 8px" }}
        stroke="var(--muted-foreground)"
        className={direction === "up-right" ? "-rotate-45" : ""}
        strokeWidth={1.5}
        strokeOpacity={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const circleArrowVariants = cva("overflow-hidden rounded-full", {
  variants: {
    variant: {
      default:
        "[&_rect]:fill-primary-foreground/10 [&_path]:stroke-primary-foreground",
      outline:
        "[&_rect]:fill-primary/3 group-hover/button:[&_rect]:fill-primary/6 [&_path]:stroke-primary/30 group-hover/button:[&_path]:stroke-primary/60",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
