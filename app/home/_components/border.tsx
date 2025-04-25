"use client";

import { motion } from "motion/react";

export function Border({
  width = "100%",
  height = 1,
  vertical = false,
  className,
}: {
  width?: string | number;
  height?: string | number;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={vertical ? 1 : width}
      height={vertical ? "100%" : height}
      preserveAspectRatio="none"
      className={className}
    >
      <title>Border</title>
      <motion.line
        x1={vertical ? 0.5 : 0}
        y1={vertical ? 0 : 0.5}
        x2={vertical ? 0.5 : "100%"}
        y2={vertical ? "100%" : 0.5}
        stroke="var(--color-border)"
        animate={{ strokeDashoffset: [0, -10] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 6"
      />
    </svg>
  );
}
