"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { ArrowLeft, ArrowRight, Funnel, X } from "lucide-react";
import { useQueryState } from "nuqs";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { Contact } from "@/contacts/lib/schema";

export const columns: ColumnDef<Contact>[] = [
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Tier",
    accessorKey: "metadata.tier",
    cell: ({ row }) => {
      const tier = row.original.metadata?.tier;
      return tier ? tier : "Free";
    },
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      if (!updatedAt) return "-";

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <time dateTime={updatedAt.toISOString()}>
              {formatDistance(updatedAt, new Date(), { addSuffix: true })}
            </time>
          </TooltipTrigger>
          <TooltipContent>
            {updatedAt.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return "-";

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <time dateTime={createdAt.toISOString()}>
              {formatDistance(createdAt, new Date(), { addSuffix: true })}
            </time>
          </TooltipTrigger>
          <TooltipContent>
            {createdAt.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];

export function DataTable({ data }: { data: Contact[] }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [search, setSearch] = useQueryState("search");
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [rowsCount, setRowsCount] = useQueryState("count", {
    defaultValue: "10",
  });

  const currentPage = page ? parseInt(page, 10) : 1;
  const pageSize = rowsCount ? parseInt(rowsCount, 10) : 10;
  const pageIndex = currentPage - 1;

  const handleSearchClear = () => {
    setSearch(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // We need this to make TypeScript happy
    // @ts-expect-error - We're not using custom filters but the type system requires it
    filterFns: {},
    state: {
      globalFilter: search ?? "",
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onGlobalFilterChange: (value) => {
      setSearch(value || null);
    },
  });

  const totalPages = table.getPageCount();

  // Generate pagination range
  const paginationItems = generatePaginationItems(currentPage, totalPages);

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value || null)}
            className="peer ps-9"
            placeholder="Filter by email..."
          />

          {/* Decorative icon */}
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Funnel size={16} />
          </div>

          {/* Clear button */}
          {Boolean(search) && (
            <button
              onClick={handleSearchClear}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear filter"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-transparent"
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
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-muted-foreground h-24 text-center"
                  >
                    {search ? (
                      <>
                        No results found for: &quot;
                        <span className="text-foreground">{search}</span>
                        &quot;.
                      </>
                    ) : (
                      "No results found."
                    )}
                  </TableCell>
                </TableRow>
              )}
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
            <span className="text-foreground">{totalPages}</span>
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
                      if (currentPage > 1) {
                        setPage((currentPage - 1).toString());
                      }
                    }}
                    disabled={currentPage <= 1}
                    aria-label="Go to previous page"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                </PaginationItem>

                {/* Page number buttons */}
                {paginationItems.map((pageNumber, i) => {
                  if (pageNumber === "dots") {
                    return (
                      <PaginationItem key={`dots-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  const isActive = pageNumber === currentPage;
                  return (
                    <PaginationItem key={`page-${pageNumber}`}>
                      <Button
                        size="icon"
                        variant={`${isActive ? "outline" : "ghost"}`}
                        onClick={() => {
                          setPage(pageNumber.toString());
                        }}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {pageNumber}
                      </Button>
                    </PaginationItem>
                  );
                })}

                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setPage((currentPage + 1).toString());
                      }
                    }}
                    disabled={currentPage >= totalPages}
                    className="disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Go to next page"
                  >
                    <ArrowRight size={16} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Results per page */}
          <div className="flex flex-1 justify-end">
            <Select
              value={rowsCount ?? "10"}
              onValueChange={(value) => setRowsCount(value)}
              aria-label="Results per page"
            >
              <SelectTrigger
                id="results-per-page"
                className="w-fit whitespace-nowrap"
              >
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>

              <SelectContent>
                {[10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}

type PaginationItem = number | "dots";

// Function to generate pagination items
function generatePaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  const delta = 1; // Number of pages to show before and after current page
  const items: PaginationItem[] = [];

  // Always include first page
  items.push(1);

  // Calculate range of pages to display
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  // Add dots if there is a gap after first page
  if (rangeStart > 2) {
    items.push("dots");
  }

  // Add range of pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    items.push(i);
  }

  // Add dots if there is a gap before last page
  if (rangeEnd < totalPages - 1) {
    items.push("dots");
  }

  // Always include last page if it exists
  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}
