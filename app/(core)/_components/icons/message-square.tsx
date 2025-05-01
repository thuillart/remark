"use client";

import { type Variants, motion } from "motion/react";

import type { IconProps } from "@/core/components/icons";
import { cn } from "@/lib/utils";

const variants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.05,
    rotate: [0, -7, 7, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut",
      },
      scale: {
        type: "spring",
        damping: 10,
        stiffness: 400,
      },
    },
  },
};

export function MessageSquareIcon({ className, isHovering }: IconProps) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      stroke="currentColor"
      viewBox="0 0 24 24"
      className={cn("overflow-visible", className)}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Message</title>

      <motion.g
        initial={false}
        animate={isHovering ? "hover" : "rest"}
        variants={variants}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </motion.g>
    </svg>
  );
}
