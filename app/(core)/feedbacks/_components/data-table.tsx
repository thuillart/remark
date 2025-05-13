"use client";

import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiCalendarLine,
  RiChat1Line,
  RiCloseLine,
  RiFilter3Line,
} from "@remixicon/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance, formatRelative } from "date-fns";
import Link from "next/link";
import { useQueryState } from "nuqs";
import React from "react";

import { TextShimmer } from "@/components/text-shimmer";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  usePagination,
} from "@/components/ui/pagination";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "@/core/components/empty-state";
import { Feedback } from "@/feedbacks/lib/schema";
import { APP_NAME } from "@/lib/constants";
import { FeedbackImpact } from "@/lib/schema";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

type ColumnDefMetadata = {
  width?: string;
};

type ColumnDefWithWidth<TData extends RowData> = ColumnDef<TData> & {
  meta: ColumnDefMetadata;
};

// 1. Columns definition
export const columns: ColumnDefWithWidth<Feedback>[] = [
  {
    header: "From",
    accessorKey: "from",
    meta: { width: "w-75.5" },
    cell: ({ row }) => {
      return (
        <Link
          href={`/feedbacks/${row.original.id}`}
          className="group/link flex items-center gap-3"
        >
          <AppIcon />
          <span className="decoration-muted-foreground pr-4.5 whitespace-nowrap underline underline-offset-5 transition-[color,text-decoration-color] duration-150 ease-in-out group-hover/link:decoration-current">
            {row.original.from}
            <RiArrowRightUpLine className="text-muted-foreground group-hover/link:text-primary absolute mt-1.25 inline-block size-[1em] no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:-translate-y-px" />
          </span>
        </Link>
      );
    },
  },
  {
    header: "Impact",
    accessorKey: "impact",
    meta: { width: "w-32" },
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <Badge variant={getImpactBadgeVariant(row.original.impact)}>
              {capitalizeFirstLetter(row.original.impact)}
            </Badge>
          </TooltipTrigger>

          <TooltipContent className="max-w-3xs px-2 py-1">
            <TextShimmer>{`${APP_NAME} AI`}</TextShimmer>{" "}
            {getImpactTooltipText(row.original.impact)}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    header: "Subject",
    accessorKey: "subject",
    meta: { width: "w-76" },
  },
  {
    header: "Sent",
    accessorKey: "createdAt",
    meta: { width: "w-42.5" },
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger className="decoration-muted-foreground cursor-pointer underline underline-offset-5 transition-[text-decoration-color] duration-150 ease-in-out hover:decoration-current">
            {/* A nice-to-read date & time */}
            {capitalizeFirstLetter(
              formatDistance(row.original.createdAt, new Date(), {
                addSuffix: true,
              }).replace("about ", ""),
            )}
          </TooltipTrigger>
          <TooltipContent>
            {/* The exact date & time */}
            {capitalizeFirstLetter(
              formatRelative(row.original.createdAt, new Date()),
            )}
            .
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];

function getImpactBadgeVariant(impact: FeedbackImpact): BadgeProps["variant"] {
  if (impact === "critical") {
    return "destructive";
  }
  if (impact === "major") {
    return "warning";
  }
  return "secondary";
}

function getImpactTooltipText(impact: FeedbackImpact) {
  if (impact === "critical") {
    return "thinks this could lead to severe user frustration if not fixed.";
  }
  if (impact === "major") {
    return "believes this might result in a leaving and disappointed user.";
  }
  return "feels this doesn't impact the user experience significantly.";
}

function AppIcon() {
  return (
    <div className="size-8">
      <div className="size-full rounded-lg p-1.25 ring ring-zinc-500/10 ring-inset dark:ring-zinc-400/20">
        <div className="flex size-full items-center justify-center rounded bg-zinc-100 text-zinc-600 ring ring-zinc-500/10 ring-inset dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20">
          <RiChat1Line size={14} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

type TimeRange =
  | "24-hours"
  | "3-days"
  | "7-days"
  | "15-days"
  | "30-days"
  | "all";

type Impact = "all" | FeedbackImpact;

const timeRanges: {
  value: TimeRange;
  label: string;
}[] = [
  {
    value: "24-hours",
    label: "Last 24 hours",
  },
  {
    value: "3-days",
    label: "Last 3 days",
  },
  {
    value: "7-days",
    label: "Last 7 days",
  },
  {
    value: "15-days",
    label: "Last 15 days",
  },
  {
    value: "30-days",
    label: "Last 30 days",
  },
  {
    value: "all",
    label: "All time",
  },
];

const impacts: {
  value: Impact;
  label: string;
  dotBgColor: string;
}[] = [
  {
    value: "critical",
    label: "Critical",
    dotBgColor: "bg-red-400",
  },
  {
    value: "major",
    label: "Major",
    dotBgColor: "bg-amber-400",
  },
  {
    value: "minor",
    label: "Minor",
    dotBgColor: "bg-blue-400",
  },
  {
    value: "all",
    label: "All",
    dotBgColor: "bg-muted-foreground",
  },
];

function SearchAndFilters() {
  // Search-related code
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [search, setSearch] = useQueryState("search", {
    parse: (v) => v,
    serialize: (v) => v || null,
    defaultValue: "",
  });

  function handleSearchClear() {
    setSearch("");
    inputRef.current?.focus();
  }

  // Filters-related code
  const [timeRange, setTimeRange] = useQueryState<TimeRange>("days", {
    parse: (v) => getTimeRangeFromNumber(Number(v)),
    serialize: (v) => String(getTimeRangeNumber(v)),
    defaultValue: "7-days",
  });

  const [impact, setImpact] = useQueryState<Impact>("impact", {
    parse: (v) => v as Impact,
    serialize: (v) => v,
    defaultValue: "all",
  });

  return (
    <div className="mb-4 grid grid-cols-1 flex-col gap-3 sm:grid-cols-2 sm:gap-2">
      {/* Search bar */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
          className="peer ps-9"
          placeholder="Filter by email..."
        />

        {/* Decorative icon */}
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <RiFilter3Line size={16} aria-hidden="true" />
        </div>

        {/* Clear button */}
        {Boolean(search) && (
          <button
            onClick={handleSearchClear}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear filter"
          >
            <RiCloseLine size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2">
        {/* Time range selector */}
        <div className="group relative">
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="relative ps-9">
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50">
                <RiCalendarLine size={16} aria-hidden="true" />
              </div>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {timeRanges.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Impact selector */}
        <Select
          value={impact}
          onValueChange={(value: Impact) => setImpact(value)}
        >
          <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
            <SelectValue placeholder="Select impact" />
          </SelectTrigger>

          <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
            {impacts.map(({ value, label, dotBgColor }) => (
              <SelectItem key={value} value={value}>
                <span className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-full", dotBgColor)} />
                  <span className="truncate">{label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type RowsCount = "5-rows" | "10-rows" | "25-rows" | "50-rows";

function getRowsCountNumber(rowsCount: RowsCount) {
  switch (rowsCount) {
    case "5-rows":
      return 5;
    case "10-rows":
      return 10;
    case "25-rows":
      return 25;
    case "50-rows":
      return 50;
  }
}

function getTimeRangeNumber(timeRange: TimeRange) {
  switch (timeRange) {
    case "24-hours":
      return 1;
    case "3-days":
      return 3;
    case "7-days":
      return 7;
    case "15-days":
      return 15;
    case "30-days":
      return 30;
    case "all":
      return 0;
  }
}

function getTimeRangeFromNumber(number: number): TimeRange {
  switch (number) {
    case 1:
      return "24-hours";
    case 3:
      return "3-days";
    case 7:
      return "7-days";
    case 15:
      return "15-days";
    case 30:
      return "30-days";
    default:
      return "all";
  }
}

export function DataTable({ data }: { data: Feedback[] }) {
  const [rowsCount, setRowsCount] = useQueryState<RowsCount>("rows", {
    parse: (v) => `${v}-rows` as RowsCount,
    serialize: (v) => (v === "5-rows" ? null : v.replace("-rows", "")),
  });

  const [activePage, setActivePage] = useQueryState<number>("page", {
    parse: (v) => Number(v) || 0,
    serialize: (v) => (v === 0 ? null : String(v)),
  });

  const [searchValue] = useQueryState("search", {
    parse: (v) => v,
    serialize: (v) => v || null,
    defaultValue: "",
  });

  const [selectedImpact] = useQueryState<Impact>("impact", {
    parse: (v) => v as Impact,
    serialize: (v) => v,
    defaultValue: "all",
  });

  const [selectedTimeRange] = useQueryState<TimeRange>("days", {
    parse: (v) => getTimeRangeFromNumber(Number(v)),
    serialize: (v) => String(getTimeRangeNumber(v)),
    defaultValue: "7-days",
  });

  const table = useReactTable<Feedback>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: getRowsCountNumber(rowsCount ?? "5-rows"),
        pageIndex: activePage ?? 0,
      },
    },
    state: {
      pagination: {
        pageSize: getRowsCountNumber(rowsCount ?? "5-rows"),
        pageIndex: activePage ?? 0,
      },
      globalFilter: searchValue,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: activePage ?? 0,
          pageSize: getRowsCountNumber(rowsCount ?? "5-rows"),
        });
        setActivePage(newState.pageIndex);
        setRowsCount(`${newState.pageSize}-rows` as RowsCount);
      }
    },
  });

  const hasRows = table.getRowModel().rows.length > 0;
  const hasFilter = selectedTimeRange !== "7-days" || selectedImpact !== "all";
  const hasSearchQuery = searchValue !== "";

  if (!hasRows && !hasFilter && !hasSearchQuery) {
    return (
      <div className="container">
        <EmptyState
          title="You haven't received any feedbacks yet"
          icons={[RiChat1Line, RiChat1Line, RiChat1Line]}
          description="Any sent feedback will appear here once received."
        />
      </div>
    );
  }

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pagesCount = table.getPageCount() || 1;

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5,
  });

  return (
    <div className="container">
      <div className="space-y-4">
        <SearchAndFilters />

        {/* Table */}
        <div className="bg-background mb-4 overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const metadata = header.column.columnDef
                      .meta as ColumnDefMetadata;

                    return (
                      <TableHead
                        key={header.id}
                        className={cn("text-muted-foreground", metadata?.width)}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {!hasRows && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No results found for: &quot;
                    <span className="text-foreground">{searchValue}</span>
                    &quot;.
                  </TableCell>
                </TableRow>
              )}

              {hasRows &&
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-transparent"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 max-sm:flex-col">
          {/* Page number information */}
          <p
            className="text-muted-foreground flex-1 text-sm whitespace-nowrap"
            aria-live="polite"
          >
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{pagesCount}</span>
          </p>

          {/* Pagination buttons */}
          <div className="grow">
            <Pagination>
              <PaginationContent>
                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    <RiArrowLeftLine size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>

                {/* Left ellipsis (...) */}
                {showLeftEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Page number buttons */}
                {pages.map((page) => {
                  const isActive =
                    page === table.getState().pagination.pageIndex + 1;
                  return (
                    <PaginationItem key={page}>
                      <Button
                        size="icon"
                        variant={`${isActive ? "outline" : "ghost"}`}
                        onClick={() => table.setPageIndex(page - 1)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  );
                })}

                {/* Right ellipsis (...) */}
                {showRightEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Go to next page"
                  >
                    <RiArrowRightLine size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Results per page */}
          <div className="flex flex-1 justify-end">
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              aria-label="Results per page"
            >
              <SelectTrigger
                id="results-per-page"
                className="w-fit whitespace-nowrap"
              >
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>

              <SelectContent>
                {[5, 10, 25, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
