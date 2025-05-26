"use client";

import { formatDistanceToNow } from "date-fns";
import { AtSign, Clock, Funnel } from "lucide-react";
import { type Transition, type Variants, motion } from "motion/react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getImpact, getTag } from "@/feedbacks/lib/utils";
import { FeedbackImpact, FeedbackTag } from "@/lib/schema";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

type Tab = {
  id: number;
  title: string;
  description: string;
};

const tabs: Tab[] = [
  {
    id: 1,
    title: "Analyze",
    description: "See who's asking for what.",
  },
  {
    id: 2,
    title: "Prioritize",
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

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.32,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

export function DemoTabs() {
  const [tab, setTab] = React.useState<Tab["id"]>(1);

  function handleClick(id: Tab["id"]) {
    if (id === tab) return;
    setTab(id);
  }

  return (
    <>
      <div className="relative mb-12 h-56 w-full pt-6 pb-0 md:h-112">
        <div className="bg-background after:from-background relative size-full overflow-hidden rounded-2xl border p-4 after:pointer-events-none after:absolute after:inset-0 after:top-auto after:h-2/3 after:bg-gradient-to-t after:to-transparent md:p-6 md:pb-0">
          <div className="relative hidden size-full rounded-2xl rounded-t-lg rounded-b-none border border-b-0 px-12 pt-16 pb-0 shadow-xs md:block">
            <SearchAndFilters />
            <div className="bg-background mb-4 size-full rounded-t-md border border-b-0">
              <DataTable selectedTabId={tab} />
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
          <AtSign size={16} />
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        <div className="group relative">
          <Select defaultValue="1">
            <SelectTrigger
              className="pointer-events-none relative ps-9"
              aria-label="Select time"
            >
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50">
                <Clock size={16} />
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
              <Funnel size={16} className="text-muted-foreground/80" />
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

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function hoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

const feedbacks: {
  from: string;
  sent: Date;
  tags: FeedbackTag[];
  impact: FeedbackImpact;
  subject: string;
}[] = [
  {
    from: "alan@turing.com",
    impact: "critical",
    subject: "Can't upgrade plan",
    sent: hoursAgo(1),
    tags: ["bug"],
  },
  {
    from: "marie@curry.com",
    impact: "minor",
    subject: "Home page footer typo",
    sent: hoursAgo(4),
    tags: ["ui"],
  },
  {
    from: "nikola@tesla.com",
    impact: "major",
    subject: "Unclear Next.js docs",
    sent: daysAgo(1),
    tags: ["dx"],
  },
  {
    from: "isaac@newton.com",
    impact: "positive",
    subject: "Love the new UI",
    sent: daysAgo(2),
    tags: ["kudos"],
  },
  {
    from: "louis@pasteur.com",
    impact: "critical",
    subject: "Invoice inquiry",
    sent: daysAgo(3),
    tags: ["billing"],
  },
];

const votes = [
  {
    request: "Add dark mode support",
    votes: 187,
    createdAt: daysAgo(1),
  },
  {
    request: "Share feedback with a friend",
    votes: 142,
    createdAt: daysAgo(2),
  },
  {
    request: "Export data to CSV",
    votes: 119,
    createdAt: daysAgo(3),
  },
  {
    request: "Get notified when a new feature is released",
    votes: 97,
    createdAt: daysAgo(4),
  },
  {
    request: "Google Sheets integration",
    votes: 76,
    createdAt: daysAgo(5),
  },
];

function DataTable({ selectedTabId }: { selectedTabId: Tab["id"] }) {
  const rows = selectedTabId === 1 ? feedbacks : votes;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="data-[state=selected]:bg-muted border-b transition-colors hover:bg-transparent">
            <TableHead className="h-12 w-10">
              <Checkbox
                aria-label="Select all"
                className="pointer-events-none"
              />
            </TableHead>
            {selectedTabId === 1 && (
              <>
                <TableHead className="h-12">From</TableHead>
                <TableHead className="h-12">Impact</TableHead>
                <TableHead className="h-12">Subject</TableHead>
                <TableHead className="h-12">Tags</TableHead>
                <TableHead className="h-12">Sent</TableHead>
              </>
            )}
            {selectedTabId === 2 && (
              <>
                <TableHead className="h-12">Request</TableHead>
                <TableHead className="h-12 text-center">Votes</TableHead>
                <TableHead className="h-12">Created</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <motion.tr
              key={selectedTabId === 1 ? row.from : row.request}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className={
                "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
              }
            >
              <TableCell>
                <Checkbox
                  className="pointer-events-none"
                  aria-label="Select row"
                />
              </TableCell>
              {selectedTabId === 1 ? (
                <>
                  <TableCell>{row.from}</TableCell>
                  <TableCell>
                    <Badge variant={getImpact(row.impact).variant}>
                      {getImpact(row.impact).label}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {row.tags.map((tag) => {
                        const tagMeta = getTag(tag as FeedbackTag);
                        return (
                          <Badge key={tag} variant={tagMeta.variant}>
                            {React.createElement(tagMeta.Icon, { size: 16 })}
                            {tagMeta.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(
                      formatDistanceToNow(row.sent, { addSuffix: true }),
                    )}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{row.request}</TableCell>
                  <TableCell className="text-center">{row.votes}</TableCell>
                  <TableCell>
                    {capitalizeFirstLetter(
                      formatDistanceToNow(row.createdAt, {
                        addSuffix: true,
                      }),
                    )}
                  </TableCell>
                </>
              )}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
