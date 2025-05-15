"use client";

import { type Transition, type Variants, motion } from "motion/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockFeedbacks } from "@/feedbacks/lib/mock-data";
import { cn } from "@/lib/utils";
import { RiAtLine, RiFilterLine, RiTimeLine } from "@remixicon/react";

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
    artwork: <div>hey</div>,
    description: "See who's asking for what.",
  },
  {
    id: 2,
    title: "Prioritize",
    artwork: <div>bye</div>,
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

const tbodyVariants: Variants = {
  animate: { transition: { staggerChildren: 0.07 } },
};

export function DemoTabs() {
  const [tab, setTab] = React.useState<Tab["id"]>(1);

  // Get the feedbacks for the current tab, sorted as needed
  function getSortedFeedbacks() {
    if (tab === 1) return mockFeedbacks.slice(0, 5); // show 5 for demo
    return mockFeedbacks.slice(0, 5).sort((a, b) => {
      const impactOrder = { critical: 0, major: 1, minor: 2 };
      if (impactOrder[a.impact] !== impactOrder[b.impact])
        return impactOrder[a.impact] - impactOrder[b.impact];
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  const feedbacks = getSortedFeedbacks();

  function handleClick(id: Tab["id"]) {
    if (id === tab) return;
    setTab(id);
  }

  return (
    <>
      <div className="relative mb-12 h-56 w-full pt-6 pb-0 md:h-112">
        <div className="bg-background after:from-background relative size-full overflow-hidden rounded-2xl border p-4 after:pointer-events-none after:absolute after:inset-0 after:top-auto after:h-2/3 after:bg-gradient-to-t after:to-transparent md:p-6 md:pb-0">
          <div className="relative size-full rounded-2xl rounded-t-lg rounded-b-none border border-b-0 px-24 pt-20 pb-0 shadow-sm">
            <SearchAndFilters />
            <div className="bg-background mb-4 size-full rounded-t-md border border-b-0">
              <Table />
            </div>
          </div>
        </div>
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

function SearchAndFilters() {
  return (
    <div className="mb-4 grid grid-cols-1 flex-col gap-3 sm:grid-cols-2 sm:gap-2">
      <div className="relative">
        <Input
          type="email"
          className="peer pointer-events-none ps-9"
          placeholder="Filter by email..."
        />

        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <RiAtLine size={16} />
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        <div className="group relative">
          <Select defaultValue="1">
            <SelectTrigger className="pointer-events-none relative ps-9">
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50">
                <RiTimeLine size={16} aria-hidden="true" />
              </div>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="group relative">
          <Button
            variant="outline"
            className="pointer-events-none w-full justify-between pl-3"
          >
            <div className="flex items-center gap-2">
              <RiFilterLine size={16} className="text-muted-foreground/80" />
              Filters
            </div>
            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex size-4.5 max-h-full items-center justify-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              2
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Table() {
  return (
    <table className="w-full text-sm" role="table">
      <thead>
        <tr className="border-b">
          {["From", "Impact", "Subject", "Sent"].map((header) => (
            <th
              key={header}
              className="text-muted-foreground h-11 px-3 text-left align-middle font-medium"
              role="columnheader"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <motion.tbody
        className="[&_tr:last-child]:border-0"
        variants={tbodyVariants}
        initial={false}
        animate="animate"
        exit="exit"
        role="rowgroup"
      ></motion.tbody>
    </table>
  );
}
