"use client";

import { cn } from "@/lib/utils";
import { type HTMLMotionProps, motion } from "motion/react";

export function FadeIn({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex", className)}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
