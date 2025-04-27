"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { useAnimate } from "framer-motion";
import React from "react";

const getRotationClass = (direction: CircleArrowProps["direction"]) => {
  switch (direction) {
    case "up-right":
      return "-rotate-45";
    case "left":
      return "rotate-180";
    default:
      return "";
  }
};

interface CircleArrowProps extends VariantProps<typeof circleArrowVariants> {
  direction: "right" | "left" | "up-right" | "up-left";
  isHovering: boolean;
}

export function CircleArrow({
  variant,
  direction,
  isHovering,
}: CircleArrowProps) {
  const [arrow1, animate1] = useAnimate();
  const [arrow2, animate2] = useAnimate();

  React.useEffect(() => {
    if (!isHovering) {
      // Reset positions instantly when not hovering
      animate1(arrow1.current, { translateX: 0 }, { duration: 0 });
      animate2(arrow2.current, { translateX: 0 }, { duration: 0 });
      return;
    }

    // Animate the paths
    Promise.all([
      animate1(
        arrow1.current,
        {
          x:
            direction === "right"
              ? [0, 20]
              : direction === "left"
                ? [-20, 0]
                : direction === "up-right"
                  ? [0, 20]
                  : [-20, 0],
        },
        {
          ease: "easeOut",
          duration: 0.22,
        },
      ),
      animate2(
        arrow2.current,
        {
          x:
            direction === "right"
              ? [-20, 0]
              : direction === "left"
                ? [0, 20]
                : direction === "up-right"
                  ? [-20, 0]
                  : [0, 20],
        },
        {
          ease: "easeOut",
          duration: 0.22,
        },
      ),
    ]);
  }, [isHovering, animate1, animate2, arrow1, arrow2, direction]);

  const rotationClass = getRotationClass(direction);

  return (
    <svg
      fill="none"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 0 16 16"
      className={circleArrowVariants({ variant })}
    >
      <title>A circle arrow</title>
      <rect rx={8} width={16} height={16} />
      <path
        d="M4.75 8L11.25 8M11.25 8L8.75 5.5M11.25 8L8.75 10.5"
        ref={arrow1}
        style={{ transformOrigin: "8px 8px" }}
        stroke="var(--muted-foreground)"
        className={rotationClass}
        strokeWidth={1.5}
        strokeOpacity={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 8L11.25 8M11.25 8L8.75 5.5M11.25 8L8.75 10.5"
        ref={arrow2}
        style={{ transformOrigin: "8px 8px" }}
        stroke="var(--muted-foreground)"
        className={rotationClass}
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
        "[&_path]:stroke-primary-foreground [&_rect]:fill-primary-foreground/10",
      outline:
        "[&_path]:stroke-primary/30 group-hover/button:[&_path]:stroke-primary/60 [&_rect]:fill-primary/3 group-hover/button:[&_rect]:fill-primary/6",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
