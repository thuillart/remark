"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  type Transition,
} from "motion/react";
import React from "react";

const transition: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.45,
};

export function HeaderLayout({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    setHasScrolled(current > 0);
  });

  return (
    <motion.div
      animate={{ y: hasScrolled ? -24 : 0 }}
      className="bg-background fixed inset-0 bottom-auto z-50"
      transition={transition}
    >
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasScrolled ? 1 : 0 }}
        className="absolute inset-0 top-auto px-0"
        transition={transition}
      >
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
      </motion.div>
    </motion.div>
  );
}
