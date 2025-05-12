"use client";

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiChat1Line,
  RiFilter3Line,
  RiSkipLeftLine,
  RiSkipRightLine,
} from "@remixicon/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useQueryState } from "nuqs";

import MultipleSelector, { Option } from "@/components/multiselect";
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
import { EmptyState } from "@/core/components/empty-state";
import { Feedback } from "@/feedbacks/lib/schema";
import { FeedbackImpact } from "@/lib/schema";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "from",
    header: "From",
    meta: {
      className: "w-18.75",
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

  return (
    <div className="relative">
      <Input
        value={search ?? ""}
        className="peer ps-9"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter by name or email..."
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <RiFilter3Line size={16} aria-hidden="true" />
      </div>
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

  const table = useReactTable<Feedback>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageSize: Number(rows ?? "5"),
        pageIndex: page ?? 0,
      },
    },
  });

  if (table.getRowModel().rows.length === 0) {
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
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(header.column.columnDef.meta?.className)}
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-transparent"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
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
