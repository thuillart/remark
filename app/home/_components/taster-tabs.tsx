"use client";

import { motion, type Transition, type Variants } from "motion/react";
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

export function TasterTabs() {
  const [tab, setTab] = React.useState<Tab["id"]>(1);

  const handleClick = (id: Tab["id"]) => {
    if (id == tab) return;
    setTab(id);
  };

  return (
    <>
      <div className="relative mb-12 h-112 w-full pt-12">
        <Frame />
        <Browser>{tabs[tab - 1].artwork}</Browser>
      </div>

      <div>
        <motion.div
          animate={tab === 1 ? "one" : "two"}
          variants={gridVariants}
          className="-mt-6 grid grid-cols-[6fr_4fr] gap-12 md:px-6"
          transition={gridTransition}
        >
          {tabs.map(({ id, title, description }) => (
            <button
              key={title}
              onClick={() => handleClick(id)}
              className="flex cursor-pointer flex-col gap-4 text-start focus-visible:outline-none"
            >
              <hr
                className={cn(
                  "border-primary rounded-full border-t-3 transition-opacity duration-200 ease-in-out",
                  { "opacity-20": id !== tab },
                )}
              />

              <h3
                className={cn(
                  "text-2xl/8 font-semibold tracking-tight transition-opacity duration-200 ease-in-out",
                  { "opacity-20": id !== tab },
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

function Browser({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative -z-1 size-full p-6 pb-0">
      {/* Frame */}
      <div className="relative size-full">
        <div className="absolute inset-x-0 top-0">
          <Line />
        </div>
        <div className="absolute inset-0 right-auto">
          <Line vertical />
        </div>
        <div className="absolute inset-0 left-auto">
          <Line vertical />
        </div>
        {/* Artwork */}
        {children}
      </div>
    </div>
  );
}

function Frame() {
  return (
    <>
      <div className="absolute -inset-x-12 top-12">
        <Line />
      </div>
      <div className="absolute top-0 -bottom-12 left-0">
        <Line vertical />
      </div>
      <div className="absolute -inset-x-12 bottom-0">
        <Line />
      </div>
      <div className="absolute top-0 right-0 -bottom-12">
        <Line vertical />
      </div>
    </>
  );
}

function Line({
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
