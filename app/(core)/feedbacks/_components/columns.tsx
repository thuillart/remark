"use client";

import { RiArrowRightUpLine, RiChat1Line } from "@remixicon/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Feedback } from "@/feedbacks/lib/schema";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      const email = row.original.from;
      return (
        <div className="flex items-center gap-2">
          <div className="border-border size-8 rounded-lg border p-0.5">
            <div className="flex size-full items-center justify-center rounded-md border bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-500/20">
              <RiChat1Line size={16} className="opacity-60" />
            </div>
          </div>
          <Link
            href={`/feedbacks/${row.original.id}`}
            className={cn(
              buttonVariants({ variant: "link" }),
              "group/link decoration-muted-foreground block pr-4.5 font-normal whitespace-nowrap underline underline-offset-5 transition-[color,text-decoration-color] duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:decoration-current",
            )}
          >
            {email}
            <RiArrowRightUpLine className="text-muted-foreground group-hover/link:text-primary absolute mt-1.25 ml-0.5 inline-block size-[1em] no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:-translate-y-px" />
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "impact",
    header: "Impact",
    cell: ({ row }) => {
      const impact = row.original.impact;

      if (impact === "critical") {
        return (
          <Badge variant="destructive">{capitalizeFirstLetter(impact)}</Badge>
        );
      }

      if (impact === "major") {
        return <Badge variant="warning">{capitalizeFirstLetter(impact)}</Badge>;
      }

      return <Badge variant="default">{capitalizeFirstLetter(impact)}</Badge>;
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const subject = row.original.subject;
      return <div className="text-sm">{subject}</div>;
    },
  },
  {
    accessorKey: "sentAt",
    header: "Sent",
    cell: ({ row }) => {
      const distance = formatDistanceToNow(row.original.createdAt, {
        addSuffix: true,
      });
      return capitalizeFirstLetter(
        distance === "less than a minute ago" ? "Now" : distance,
      );
    },
  },
];
