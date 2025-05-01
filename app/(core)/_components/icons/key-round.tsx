"use client";

import { type Variants, motion } from "motion/react";

import type { IconProps } from "@/core/components/icons";
import { cn } from "@/lib/utils";
import type { Transition } from "motion";

const transition: Transition = {
  duration: 0.9,
  times: [0, 0.2, 0.4, 0.6, 1],
  ease: [0.25, 0.1, 0.25, 1],
};

const variants: Variants = {
  rest: {
    y: 0,
    rotate: 0,
  },
  hover: {
    y: [0, -3, 0, -2, 0],
    rotate: [0, 3, -3, 0, 0],
  },
};
export function KeyRoundIcon({ className, isHovering }: IconProps) {
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
      <title>API Keys</title>

      <motion.g
        initial={false}
        animate={isHovering ? "hover" : "rest"}
        variants={variants}
        transition={transition}
      >
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
      </motion.g>
    </svg>
  );
}
