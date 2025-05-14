"use client";

import {
  RemixiconComponentType,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiBookLine,
  RiBugLine,
  RiCalendarLine,
  RiChat1Line,
  RiCloseLine,
  RiCodeLine,
  RiFilter3Line,
  RiLightbulbLine,
  RiMoneyDollarBoxLine,
  RiPaletteLine,
  RiSettingsLine,
  RiShieldLine,
  RiSpeedLine,
  RiTerminalLine,
  RiThumbUpLine,
  RiTranslate2,
  RiUserVoiceLine,
} from "@remixicon/react";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance, formatRelative } from "date-fns";
import Link from "next/link";
import { useQueryState } from "nuqs";
import React from "react";

import { TextShimmer } from "@/components/text-shimmer";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  usePagination,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "@/core/components/empty-state";
import { PageIcon } from "@/core/components/page-icon";
import { Feedback } from "@/feedbacks/lib/schema";
import { APP_NAME } from "@/lib/constants";
import { FeedbackImpact } from "@/lib/schema";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

declare module "@tanstack/table-core" {
  interface FilterFns {
    timeRange: FilterFn<Feedback>;
    impact: FilterFn<Feedback>;
    tags: FilterFn<Feedback>;
  }
}

function getTag(tag: string): {
  Icon: RemixiconComponentType;
  label: string;
  variant: BadgeProps["variant"];
} {
  switch (tag) {
    case "bug":
      return {
        Icon: RiBugLine,
        label: "Bug",
        variant: "destructive",
      };
    case "feature_request":
      return {
        Icon: RiLightbulbLine,
        label: "Request",
        variant: "yellow",
      };
    case "enhancement":
      return {
        Icon: RiSettingsLine,
        label: "Enhancement",
        variant: "teal",
      };
    case "ui":
      return {
        Icon: RiPaletteLine,
        label: "UI",
        variant: "pink",
      };
    case "ux":
      return {
        Icon: RiUserVoiceLine,
        label: "UX",
        variant: "orange",
      };
    case "performance":
      return {
        Icon: RiSpeedLine,
        label: "Performance",
        variant: "yellow",
      };
    case "security":
      return {
        Icon: RiShieldLine,
        label: "Security",
        variant: "destructive",
      };
    case "billing":
      return {
        Icon: RiMoneyDollarBoxLine,
        label: "Billing",
        variant: "green",
      };
    case "api":
      return {
        Icon: RiCodeLine,
        label: "API",
        variant: "blue",
      };
    case "dx":
      return {
        Icon: RiTerminalLine,
        label: "DX",
        variant: "indigo",
      };
    case "lang":
      return {
        Icon: RiTranslate2,
        label: "Language",
        variant: "yellow",
      };
    case "legal":
      return {
        Icon: RiBookLine,
        label: "Legal",
        variant: "purple",
      };
    case "appraisal":
      return {
        Icon: RiThumbUpLine,
        label: "Appraisal",
        variant: "teal",
      };
  }
}

// 1. Columns definition
export const columns: ColumnDef<Feedback>[] = [
  {
    header: "From",
    accessorKey: "from",
    cell: ({ row }) => {
      return (
        <Link
          href={`/feedbacks/${row.original.id}`}
          className="group/link flex items-center gap-3"
        >
          <PageIcon size="md" Icon={RiChat1Line} />
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
    filterFn: "impact",
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
    header: "Tags",
    accessorKey: "tags",

    cell: ({ row }) => {
      let tags: string[] = [];

      if (typeof row.original.tags === "string") {
        tags = parsePgArray(row.original.tags);
      } else if (Array.isArray(row.original.tags)) {
        tags = row.original.tags;
      }

      const [firstTag, ...otherTags] = tags;
      const hasMore = otherTags.length > 0;

      return (
        <div className="flex flex-nowrap gap-2">
          {firstTag && (
            <Badge variant={getTag(firstTag).variant} className="relative">
              {React.createElement(getTag(firstTag).Icon, { size: 16 })}
              {getTag(firstTag).label}
            </Badge>
          )}
          {hasMore && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-pointer">
                    +{otherTags.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="p-1">
                  <div className="flex flex-wrap gap-1">
                    {otherTags.map((tag) => {
                      const tagMeta = getTag(tag);
                      return (
                        <Badge key={tag} variant={tagMeta.variant}>
                          {React.createElement(tagMeta.Icon, { size: 16 })}
                          {tagMeta.label}
                        </Badge>
                      );
                    })}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    header: "Subject",
    accessorKey: "subject",
  },
  {
    header: "Sent",
    accessorKey: "createdAt",
    filterFn: "timeRange",
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
    dotBgColor: "bg-muted-foreground",
  },
  {
    value: "all",
    label: "All",
    dotBgColor: "bg-muted",
  },
];

function SearchAndFilters({ data }: { data: Feedback[] }) {
  // Search-related code
  const inputRef = React.useRef<HTMLInputElement>(null);
  const id = React.useId();

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

  const [selectedTags, setSelectedTags] = useQueryState<string[]>("tags", {
    parse: (v) => (v ? v.split(",") : []),
    serialize: (v) => (v.length ? v.join(",") : null),
    defaultValue: [],
  });

  // Get unique tags from data
  const uniqueTags = React.useMemo(() => {
    const tags = new Set<string>();
    data.forEach((item) => {
      if (typeof item.tags === "string") {
        parsePgArray(item.tags).forEach((tag) => tags.add(tag));
      } else if (Array.isArray(item.tags)) {
        item.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [data]);

  // Get tag counts
  const tagCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((item) => {
      const tags =
        typeof item.tags === "string" ? parsePgArray(item.tags) : item.tags;
      tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return counts;
  }, [data]);

  const handleTagChange = (checked: boolean, value: string) => {
    const newTags = checked
      ? [...selectedTags, value]
      : selectedTags.filter((tag) => tag !== value);
    setSelectedTags(newTags);
  };

  const hasSelectedTags = selectedTags.length > 0;

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
      <div className="grid grid-cols-3 gap-2">
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

        {/* Tag filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between">
              <div className="flex items-center gap-2">
                <RiFilter3Line size={16} className="-ms-1 opacity-60" />
                Tags
              </div>
              {hasSelectedTags && (
                <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full w-4.5 items-center justify-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-39 p-3" align="start">
            <div className="space-y-3">
              <div className="text-muted-foreground text-xs font-medium">
                Filter by tags
              </div>
              <div className="space-y-3">
                {uniqueTags.map((tag, i) => {
                  const tagMeta = getTag(tag);
                  return (
                    <div key={tag} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-tag-${i}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked: boolean) =>
                          handleTagChange(checked, tag)
                        }
                      />
                      <Label
                        htmlFor={`${id}-tag-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {tagMeta.label}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {tagCounts.get(tag)}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

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

function getDateFromTimeRange(timeRange: TimeRange): Date | null {
  const now = new Date();
  const hoursInMs = 60 * 60 * 1000;

  switch (timeRange) {
    case "24-hours":
      return new Date(now.getTime() - 24 * hoursInMs);
    case "3-days":
      return new Date(now.getTime() - 3 * 24 * hoursInMs);
    case "7-days":
      return new Date(now.getTime() - 7 * 24 * hoursInMs);
    case "15-days":
      return new Date(now.getTime() - 15 * 24 * hoursInMs);
    case "30-days":
      return new Date(now.getTime() - 30 * 24 * hoursInMs);
    case "all":
      return null;
    default:
      return null;
  }
}

function parsePgArray(str: string): string[] {
  if (!str) return [];
  return str
    .slice(1, -1) // remove {}
    .split(/","|",?/) // split on "," or ,
    .map((s) => s.replace(/^"|"$/g, "")) // remove leading/trailing quotes
    .filter(Boolean);
}

export function DataTable({ data }: { data: Feedback[] }) {
  // State from URL parameters
  const [rowsCount, setRowsCount] = useQueryState<RowsCount>("rows", {
    parse: (v) => `${v}-rows` as RowsCount,
    serialize: (v) => (v === "5-rows" ? null : v.replace("-rows", "")),
    defaultValue: "5-rows",
  });

  const [activePage, setActivePage] = useQueryState<number>("page", {
    parse: (v) => Number(v) || 0,
    serialize: (v) => (v === 0 ? null : String(v)),
    defaultValue: 0,
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

  const [selectedTags] = useQueryState<string[]>("tags", {
    parse: (v) => (v ? v.split(",") : []),
    serialize: (v) => (v.length ? v.join(",") : null),
    defaultValue: [],
  });

  // Prevent recreating the table instance when URL parameters change
  // by memoizing it with a stable reference
  const tableMeta = React.useMemo(
    () => ({
      pageSize: getRowsCountNumber(rowsCount),
      pageIndex: activePage,
    }),
    [rowsCount, activePage],
  );

  // Update the memoized reference values when URL parameters change
  React.useEffect(() => {
    tableMeta.pageSize = getRowsCountNumber(rowsCount);
    tableMeta.pageIndex = activePage;
  }, [tableMeta, rowsCount, activePage]);

  const table = useReactTable<Feedback>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageSize: tableMeta.pageSize,
        pageIndex: tableMeta.pageIndex,
      },
      globalFilter: searchValue,
      columnFilters: [
        {
          id: "impact",
          value: selectedImpact,
        },
        {
          id: "createdAt",
          value: selectedTimeRange,
        },
        {
          id: "tags",
          value: selectedTags,
        },
      ],
    },
    filterFns: {
      impact: (row, columnId, filterValue: Impact) => {
        const impact = row.getValue(columnId) as FeedbackImpact;
        return filterValue === "all" ? true : impact === filterValue;
      },
      timeRange: (row, columnId, filterValue: TimeRange) => {
        const date = row.getValue(columnId) as Date;
        const startDate = getDateFromTimeRange(filterValue);
        return startDate ? date.getTime() >= startDate.getTime() : true;
      },
      tags: (row, columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true;
        const tags =
          typeof row.original.tags === "string"
            ? parsePgArray(row.original.tags)
            : row.original.tags;
        return filterValue.every((tag) => tags.includes(tag));
      },
    },
    manualPagination: true, // Important: manually control pagination
    enableColumnFilters: true,
    onPaginationChange: (updater) => {
      let newPagination: PaginationState;

      if (typeof updater === "function") {
        newPagination = updater({
          pageIndex: tableMeta.pageIndex,
          pageSize: tableMeta.pageSize,
        });
      } else {
        newPagination = updater;
      }

      // Update the URL query parameter first
      setActivePage(newPagination.pageIndex);

      // Update the local stable reference
      tableMeta.pageIndex = newPagination.pageIndex;

      // If page size changed, update the rows count parameter
      if (newPagination.pageSize !== tableMeta.pageSize) {
        const newRowsCount = `${newPagination.pageSize}-rows` as RowsCount;
        if (
          ["5-rows", "10-rows", "25-rows", "50-rows"].includes(newRowsCount)
        ) {
          setRowsCount(newRowsCount);
          tableMeta.pageSize = newPagination.pageSize;
        }
      }
    },
  });

  // Get filtered data based on current filters
  const filteredData = data.filter((item) => {
    // Filter by impact
    if (selectedImpact !== "all" && item.impact !== selectedImpact) {
      return false;
    }

    // Filter by time range
    const startDate = getDateFromTimeRange(selectedTimeRange);
    if (startDate && item.createdAt.getTime() < startDate.getTime()) {
      return false;
    }

    // Filter by search term
    if (
      searchValue &&
      !item.from.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Reset to first page when filters change if current page would be out of bounds
  // Move useEffect before any conditional rendering to avoid React Hook warnings
  React.useEffect(() => {
    const maxPageIndex = Math.max(
      0,
      Math.ceil(filteredData.length / tableMeta.pageSize) - 1,
    );
    if (tableMeta.pageIndex > maxPageIndex) {
      // Current page is now out of bounds due to filtering
      setActivePage(0);
      tableMeta.pageIndex = 0;
    }
  }, [
    selectedImpact,
    selectedTimeRange,
    searchValue,
    filteredData.length,
    tableMeta,
    setActivePage,
  ]);

  // Manually handle pagination
  const startIndex = tableMeta.pageIndex * tableMeta.pageSize;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + tableMeta.pageSize,
  );

  // Calculate accurate pagination information based on filtered data
  const pagesCount = Math.max(
    1,
    Math.ceil(filteredData.length / tableMeta.pageSize),
  );
  const currentPage = Math.min(tableMeta.pageIndex + 1, pagesCount);
  const canPreviousPage = tableMeta.pageIndex > 0;
  const canNextPage = startIndex + tableMeta.pageSize < filteredData.length;

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    totalPages: pagesCount,
    currentPage: currentPage,
    paginationItemsToDisplay: 5,
  });

  const hasRows = data.length > 0;
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

  return (
    <div className="container">
      <div className="flex flex-col gap-4">
        <SearchAndFilters data={data} />

        {/* Table */}
        <div className="w-full overflow-hidden">
          <div className="bg-background mb-4 rounded-md border">
            <Table className="shrink-0">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn("text-muted-foreground")}
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
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-muted-foreground h-24 text-center"
                    >
                      {searchValue ? (
                        <>
                          No results found for: &quot;
                          <span className="text-foreground">{searchValue}</span>
                          &quot;.
                        </>
                      ) : (
                        "No results found."
                      )}
                    </TableCell>
                  </TableRow>
                )}

                {paginatedData.length > 0 &&
                  table.getRowModel().rows.map((tableRow) => (
                    <TableRow key={tableRow.id}>
                      {tableRow.getVisibleCells().map((cell) => (
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
                      onClick={() => {
                        if (canPreviousPage) {
                          table.previousPage();
                        }
                      }}
                      disabled={!canPreviousPage}
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
                    const isActive = page === currentPage;
                    return (
                      <PaginationItem key={page}>
                        <Button
                          size="icon"
                          variant={`${isActive ? "outline" : "ghost"}`}
                          onClick={() => {
                            table.setPageIndex(page - 1);
                          }}
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
                      onClick={() => {
                        if (canNextPage) {
                          table.nextPage();
                        }
                      }}
                      disabled={!canNextPage}
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
                value={String(tableMeta.pageSize)}
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
    </div>
  );
}
