"use client";

import { type Variants, motion } from "motion/react";

import type { IconProps } from "@/core/components/icons";
import { cn } from "@/lib/utils";

const pathVariants: Variants = {
  rest: {
    translateY: 0,
    opacity: 1,
    transition: {
      type: "tween",
      stiffness: 200,
      damping: 13,
    },
  },
  hover: (i: number) => ({
    translateY: [2 * i, 0],
    opacity: [0, 1],
    transition: {
      delay: 0.25 * (2 - i),
      type: "tween",
      stiffness: 200,
      damping: 13,
    },
  }),
};

export function GalleryVerticalEndIcon({ className, isHovering }: IconProps) {
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
      <title>Gallery</title>

      <motion.path
        d="M7 2h10"
        custom={1}
        animate={isHovering ? "hover" : "rest"}
        variants={pathVariants}
      />
      <motion.path
        d="M5 6h14"
        custom={2}
        animate={isHovering ? "hover" : "rest"}
        variants={pathVariants}
      />
      <rect width="18" height="12" x="3" y="10" rx="2" />
    </svg>
  );
}
