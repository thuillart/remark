"use client";

import { motion } from "motion/react";

export function Separator() {
  return (
    <div className="px-4 md:px-12">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height={1}
        className="container !px-0"
        preserveAspectRatio="none"
      >
        <motion.line
          x1={0}
          y1={0.5}
          x2="100%"
          y2={0.5}
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
    </div>
  );
}
