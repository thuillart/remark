"use client";

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiChat1Line,
  RiCloseLine,
  RiFilter3Line,
  RiSkipLeftLine,
  RiSkipRightLine,
} from "@remixicon/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useRef } from "react";

import MultipleSelector, { Option } from "@/components/multiselect";
import { TextShimmer } from "@/components/text-shimmer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "from",
    header: "From",
    meta: {
      width: "w-75.5",
    },
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
    meta: {
      width: "w-32",
    },
    cell: ({ row }) => {
      const impact = row.original.impact;

      if (impact === "critical") {
        return (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="destructive">
                {capitalizeFirstLetter(impact)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-3xs px-2 py-1">
              <TextShimmer>{`${APP_NAME} AI`}</TextShimmer> thinks this could
              lead to severe user frustration if not fixed.
            </TooltipContent>
          </Tooltip>
        );
      }
      if (impact === "major") {
        return (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="warning">{capitalizeFirstLetter(impact)}</Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-3xs px-2 py-1">
              <TextShimmer>{`${APP_NAME} AI`}</TextShimmer> believes this might
              result in a leaving and disappointed user.
            </TooltipContent>
          </Tooltip>
        );
      }

      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default">{capitalizeFirstLetter(impact)}</Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-3xs px-2 py-1">
            <TextShimmer>{`${APP_NAME} AI`}</TextShimmer> feels this
            doesn&apos;t impact the user experience significantly.
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    meta: {
      width: "w-76",
    },
    cell: ({ row }) => {
      const subject = row.original.subject;
      return <div className="text-sm">{subject}</div>;
    },
  },
  {
    accessorKey: "sentAt",
    header: "Sent",
    meta: {
      width: "w-42.5",
    },
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

function Topbar() {
  return (
    <div className="mb-4 grid grid-cols-1 flex-col gap-3 sm:grid-cols-2 sm:gap-2">
      <Searchbar />
      <Filters />
    </div>
  );
}

function Searchbar() {
  const [search, setSearch] = useQueryState("search", {
    parse: (value) => value,
    serialize: (value) => value || null,
    defaultValue: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={search ?? ""}
        onChange={(e) => setSearch(e.target.value)}
        className="peer ps-9"
        placeholder="Filter by email..."
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <RiFilter3Line size={16} aria-hidden="true" />
      </div>
      {Boolean(search) && (
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear filter"
          onClick={() => {
            setSearch("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <RiCloseLine size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

type LastDays = "1" | "3" | "7" | "15" | "30" | "all";

const impacts: Option[] = [
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
  { value: "critical", label: "Critical" },
];

function Filters() {
  const [lastDays, setLastDays] = useQueryState<LastDays>("days", {
    parse: (value) => value as LastDays,
    serialize: (value) => value,
    defaultValue: "7",
  });

  const [selectedImpacts, setSelectedImpacts] = useQueryState<FeedbackImpact[]>(
    "impact",
    {
      parse: (value) => (value?.split(",") as FeedbackImpact[]) ?? [],
      serialize: (value) => (value.length > 0 ? value.join(",") : null),
      defaultValue: [],
    },
  );

  function handleImpactChange(options: Option[]) {
    setSelectedImpacts(options.map((opt) => opt.value as FeedbackImpact));
  }

  function getSelectedImpactOptions(
    selectedImpacts?: FeedbackImpact[],
  ): Option[] {
    if (!selectedImpacts?.length) return [];
    return selectedImpacts.map((value) => {
      const option = impacts.find((i) => i.value === value);
      return {
        value,
        label: option?.label ?? value,
        variant:
          value === "critical"
            ? "destructive"
            : value === "major"
              ? "warning"
              : "secondary",
      };
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={lastDays}
        onValueChange={(value: LastDays) => setLastDays(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Last 24 hours</SelectItem>
          <SelectItem value="3">Last 3 days</SelectItem>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="15">Last 15 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>

      <MultipleSelector
        value={getSelectedImpactOptions(selectedImpacts)}
        onChange={handleImpactChange}
        placeholder="Select impact"
        commandProps={{ label: "Impact it has on user" }}
        emptyIndicator
        defaultOptions={impacts}
        hidePlaceholderWhenSelected
      />
    </div>
  );
}

type Rows = "5" | "10" | "25" | "50";

export function DataTable({ data }: { data: Feedback[] }) {
  const [rows, setRows] = useQueryState<Rows>("rows", {
    parse: (v) => (v as Rows) || "5",
    serialize: (v) => (v === "5" ? null : v),
  });

  const [page, setPage] = useQueryState<number>("page", {
    parse: (v) => Number(v) || 0,
    serialize: (v) => (v === 0 ? null : String(v)),
  });

  const [search] = useQueryState("search", {
    parse: (value) => value,
    serialize: (value) => value || null,
    defaultValue: "",
  });

  const table = useReactTable<Feedback>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageSize: Number(rows ?? "5"),
        pageIndex: page ?? 0,
      },
      globalFilter: search ?? "",
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId) || "").toLowerCase();
      const filter = String(filterValue).toLowerCase();
      return (
        value.includes(filter) ||
        (row.original.from &&
          row.original.from.toLowerCase().includes(filter)) ||
        (row.original.subject &&
          row.original.subject.toLowerCase().includes(filter))
      );
    },
  });

  if (table.getRowModel().rows.length === 0 && !search) {
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
      <Topbar />

      <div className="bg-background mb-4 overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const metadata = header.column.columnDef.meta as
                    | { width?: string }
                    | undefined;

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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No results found for: &quot;
                  <span className="text-foreground">{search}</span>&quot;.
                </TableCell>
              </TableRow>
            ) : (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label className="max-sm:sr-only">Rows per page</Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              setRows(value as Rows);
            }}
          >
            <SelectTrigger className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            Page{" "}
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              {" – "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getRowCount(),
              )}
            </span>{" "}
            of <span className="text-foreground">{table.getRowCount()}</span>{" "}
            {table.getRowCount() === 1 ? "feedback" : "feedbacks"}
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPage(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <RiSkipLeftLine size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>

              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPage((page ?? 0) - 1)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <RiArrowLeftSLine size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>

              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPage((page ?? 0) + 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <RiArrowRightSLine size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>

              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setPage(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <RiSkipRightLine size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
