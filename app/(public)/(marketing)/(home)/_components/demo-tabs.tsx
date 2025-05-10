"use client";

import { type Transition, type Variants, motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

type Tab = {
  id: number;
  title: string;
  artwork: React.ReactNode;
  description: string;
};

const tabs: Tab[] = [
  {
    id: 1,
    title: "Analyze",
    artwork: <div />,
    description: "See who's asking for what.",
  },
  {
    id: 2,
    title: "Prioritize",
    artwork: <div />,
    description: "Most asked features come first.",
  },
];

const gridVariants: Variants = {
  one: { gridTemplateColumns: "6fr 4fr" },
  two: { gridTemplateColumns: "4fr 6fr" },
};

const gridTransition: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

const paragraphVariants: Variants = {
  one: { opacity: 0, y: -6 },
  two: { opacity: 1, y: 0 },
};

export function DemoTabs() {
  const [tab, setTab] = React.useState<Tab["id"]>(1);

  const handleClick = (id: Tab["id"]) => {
    if (id === tab) return;
    setTab(id);
  };

  return (
    <>
      <div className="relative mb-12 h-56 w-full pt-6 pb-0 md:h-112">
        <View>{tabs[tab - 1].artwork}</View>
      </div>

      <div className="overflow-hidden">
        <motion.div
          layout="preserve-aspect"
          animate={tab === 1 ? "one" : "two"}
          variants={gridVariants}
          className="grid grid-cols-[6fr_4fr] gap-12 md:px-6"
          transition={gridTransition}
        >
          {tabs.map(({ id, title, description }) => (
            <button
              key={title}
              type="button"
              onClick={() => handleClick(id)}
              className="flex cursor-pointer flex-col gap-4 text-start focus-visible:outline-none"
            >
              <hr
                className={cn(
                  "border-primary rounded-full border-t-3 transition-colors duration-200 ease-in-out",
                  { "border-muted-foreground": id !== tab },
                )}
              />

              <h3
                className={cn(
                  "text-2xl/8 font-semibold tracking-tight transition-colors duration-200 ease-in-out",
                  { "text-muted-foreground": id !== tab },
                )}
              >
                {title}
              </h3>

              <motion.p
                initial={{ opacity: tab === id ? 1 : 0 }}
                animate={tab === id ? "two" : "one"}
                variants={paragraphVariants}
                className="text-muted-foreground"
                transition={{ delay: tab === id ? 0.4 : 0, duration: 0.15 }}
              >
                {description}
              </motion.p>
            </button>
          ))}
        </motion.div>
      </div>
    </>
  );
}

function View({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background after:from-background relative size-full overflow-hidden rounded-2xl border p-4 after:absolute after:inset-0 after:bg-gradient-to-t after:to-transparent md:p-6 md:pb-0">
      <div className="relative size-full rounded-2xl rounded-t-lg rounded-b-none border border-b-0 shadow-sm">
        {children}
      </div>
    </div>
  );
}
