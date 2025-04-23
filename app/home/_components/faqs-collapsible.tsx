"use client";

import { motion, Transition } from "motion/react";
import { useState } from "react";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 20,
  stiffness: 220,
};

export function FAQsCollapsible({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="border-border mb-2 rounded-xl border">
          <button
            onClick={() => setOpen(open === index ? null : index)}
            className="flex w-full cursor-pointer items-center justify-between pr-2 pl-6 text-start focus-visible:outline-none max-md:py-2.5 md:h-18"
          >
            <h3 className="text-lg/6 font-medium tracking-tight">
              {item.question}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="52"
              viewBox="0 0 52 52"
              className="shrink-0"
            >
              <motion.path
                d="M19 25.5H26L33 25.5"
                stroke="currentColor"
                animate={{ rotateZ: open === index ? 180 : 0 }}
                transition={transition}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <motion.path
                d="M26 18.5L26 25.5L26 32.5"
                stroke="currentColor"
                animate={{
                  scale: open === index ? 0 : 1,
                  rotateZ: open === index ? 80 : 0,
                }}
                transition={transition}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: open === index ? "auto" : 0 }}
            className="overflow-hidden"
            transition={{
              type: "spring",
              mass: 0.2,
              damping: 18,
              stiffness: 280,
            }}
          >
            <motion.div className="text-muted-foreground max-w-9/10 pb-4 pl-6 md:pb-5.5">
              <p>{item.answer}</p>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
