"use client";

import { type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";

import type { IconProps } from "@/core/components/icons";
import { cn } from "@/lib/utils";

const pathVariants: Variants = {
  rest: {
    translateX: 0,
    transition: {
      type: "spring",
      damping: 13,
      stiffness: 200,
    },
  },
  hover: {
    translateX: -5,
    transition: {
      type: "spring",
      damping: 13,
      stiffness: 200,
    },
  },
};

export function UsersIcon({ className, isHovering }: IconProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isHovering) {
      setShouldAnimate(true);
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHovering]);

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
      <title>Users</title>

      <path d="M18 21a8 8 0 0 0-16 0" />

      <circle cx="10" cy="8" r="5" />

      <motion.path
        d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"
        variants={pathVariants}
        animate={shouldAnimate ? "hover" : "rest"}
      />
    </svg>
  );
}
