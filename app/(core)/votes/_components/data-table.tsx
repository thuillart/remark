"use client";

import { deleteVote, updateVote } from "@/lib/db/actions";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance, formatRelative } from "date-fns";
import {
  Archive,
  BadgeAlert,
  CheckCircle,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlert,
  CircleX,
  Clock3,
  Construction,
  Filter,
  ListFilter,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import { VoteStatus, voteStatusSchema } from "@/lib/schema";
import { capitalizeFirstLetter, cn, toast } from "@/lib/utils";
import { Vote } from "@/votes/lib/schema";
import { getStatus } from "@/votes/lib/utils";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Vote> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.subject}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Vote> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const columns: ColumnDef<Vote>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { Icon, label, variant } = getStatus(row.getValue("status"));
      return (
        <Badge variant={variant}>
          <Icon />
          {label}
        </Badge>
      );
    },
    size: 100,
    filterFn: statusFilterFn,
  },

  {
    accessorKey: "count",
    header: "Voters",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("count")}</div>
    ),
    size: 100,
  },

  {
    accessorKey: "subject",
    header: "Subject",
    size: 220,
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const exactDate = formatRelative(row.original.createdAt, new Date());
      const displayDate = formatDistance(row.original.createdAt, new Date(), {
        addSuffix: true,
      }).replace("about ", "");

      return (
        <Tooltip>
          <TooltipTrigger className="decoration-muted-foreground cursor-pointer underline underline-offset-5 transition-[text-decoration-color] duration-150 ease-in-out hover:decoration-current">
            {capitalizeFirstLetter(displayDate)}
          </TooltipTrigger>
          <TooltipContent>{capitalizeFirstLetter(exactDate)}</TooltipContent>
        </Tooltip>
      );
    },
    size: 150,
  },
];

export function DataTable({ data }: { data: Vote[] }) {
  console.log("DataTable received data", data);
  const id = React.useId();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<null | "delete" | "update">(
    null,
  );
  const [openDialog, setOpenDialog] = React.useState<
    null | VoteStatus | "delete"
  >(null);

  // --- nuqs state management ---
  // Pagination: rows per page
  const [rows, setRows] = useQueryState<number>("rows", {
    parse: (v) => Number(v) || 10,
    serialize: (v) => (v === 10 ? null : String(v)),
    defaultValue: 10,
  });
  // Page index
  const [page, setPage] = useQueryState<number>("page", {
    parse: (v) => Number(v) || 0,
    serialize: (v) => (v === 0 ? null : String(v)),
    defaultValue: 0,
  });
  // Status filter
  const [status, setStatus] = useQueryState<string[]>("status", {
    parse: (v) => (v ? v.split(",") : []),
    serialize: (v) => (v.length ? v.join(",") : null),
    defaultValue: voteStatusSchema.options.filter((s) => s !== "completed"),
  });
  // Subject search
  const [search, setSearch] = useQueryState<string>("search", {
    parse: (v) => v || "",
    serialize: (v) => (v ? v : null),
    defaultValue: "",
  });
  // Sorting (subject only)
  const [sort, setSort] = useQueryState<string>("sort", {
    parse: (v) => v || "ascending",
    serialize: (v) => (v === "ascending" ? null : v),
    defaultValue: "ascending",
  });

  // --- Handlers to update URL state ---
  function handlePageChange(newPage: number) {
    setPage(newPage);
  }
  function handleRowsChange(newRows: number) {
    setRows(newRows);
    setPage(0); // reset to first page
  }
  function handleStatusChange(checked: boolean, value: VoteStatus) {
    let newStatus = status ? [...status] : [];
    if (checked) {
      newStatus.push(value);
    } else {
      newStatus = newStatus.filter((s) => s !== value);
    }
    setStatus(
      newStatus.length
        ? newStatus
        : voteStatusSchema.options.filter((s) => s !== "completed"),
    );
    setPage(0);
  }
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(0);
  }
  function handleSortChange(desc: boolean) {
    setSort(desc ? "descending" : "ascending");
  }

  // --- Table instance ---
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      let next: SortingState;
      if (typeof updater === "function") {
        next = updater([{ id: "subject", desc: sort === "descending" }]);
      } else {
        next = updater;
      }
      if (next.length && next[0].id === "subject") {
        handleSortChange(next[0].desc);
      }
    },
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      let next: PaginationState;
      if (typeof updater === "function") {
        next = updater({ pageIndex: page, pageSize: rows });
      } else {
        next = updater;
      }
      handlePageChange(next.pageIndex);
      if (next.pageSize !== rows) handleRowsChange(next.pageSize);
    },
    onColumnFiltersChange: (updater) => {
      let next: ColumnFiltersState;
      if (typeof updater === "function") {
        next = updater([
          { id: "status", value: status },
          { id: "subject", value: search },
        ]);
      } else {
        next = updater;
      }
      const statusFilter = next.find((f) => f.id === "status");
      const subjectFilter = next.find((f) => f.id === "subject");
      if (statusFilter) setStatus(statusFilter.value as string[]);
      if (subjectFilter) setSearch(subjectFilter.value as string);
      setPage(0);
    },
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting: [{ id: "subject", desc: sort === "descending" }],
      pagination: { pageIndex: page, pageSize: rows },
      columnFilters: [
        { id: "status", value: status },
        { id: "subject", value: search },
      ],
    },
    filterFns: undefined,
  });
  console.log(
    "Table row data",
    table.getRowModel().rows.map((r) => r.original),
  );

  // Always show all possible statuses
  const allStatusValues = voteStatusSchema.options;

  // Get counts for each status
  const statusCounts = React.useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table]);

  const selectedStatuses = (table.getColumn("status")?.getFilterValue() ??
    []) as string[];

  // --- Bulk mutation handlers ---
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  function handleBulkStatusUpdate(status: VoteStatus) {
    if (!selectedIds.length) return;
    setIsLoading("update");
    updateVote({ voteIds: selectedIds, status }).then((result) => {
      if (result?.data?.failure) {
        toast({
          Icon: BadgeAlert,
          title: "Failed to update votes",
          variant: "destructive",
          description: result?.data?.failure,
        });
        setIsLoading(null);
        return;
      }
      if (result?.data?.success) {
        const count = selectedIds.length;
        const label = getStatus(status).label;
        toast({
          Icon: CheckCircle,
          title: "Updated successfully",
          description: `Updated ${count} ${count === 1 ? "vote" : "votes"} to ${label}.`,
        });
        router.refresh();
        table.resetRowSelection();
        setOpenDialog(null);
        setIsLoading(null);
      }
    });
  }

  function handleBulkDelete() {
    if (!selectedIds.length) return;
    setIsLoading("delete");
    deleteVote({ voteIds: selectedIds }).then((result) => {
      if (result?.data?.failure) {
        toast({
          Icon: BadgeAlert,
          title: "Failed to delete votes",
          variant: "destructive",
          description: result?.data?.failure,
        });
        setIsLoading(null);
        return;
      }
      if (result?.data?.success) {
        const count = selectedIds.length;
        toast({
          Icon: CheckCircle,
          title: "Deleted successfully",
          description: `Deleted ${count} ${count === 1 ? "vote" : "votes"}.`,
        });
        router.refresh();
        table.resetRowSelection();
        setOpenDialog(null);
        setIsLoading(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-3 max-sm:flex-wrap">
        <div className="flex gap-3 sm:grid sm:w-1/2 sm:grid-cols-4">
          {/* Filter by subject */}
          <div className="relative col-span-3">
            <Input
              id={`${id}-input`}
              className={cn(
                "peer ps-9",
                Boolean(table.getColumn("subject")?.getFilterValue()) && "pe-9",
              )}
              value={
                (table.getColumn("subject")?.getFilterValue() ?? "") as string
              }
              onChange={(e) => handleSearchChange(e.target.value)}
              type="text"
              aria-label="Filter by subject"
              placeholder="Filter by subject..."
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilter size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("subject")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("subject")?.setFilterValue("");
                }}
              >
                <CircleX size={16} />
              </button>
            )}
          </div>

          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter size={16} className="-ms-1 opacity-60" />
                Status
                {selectedStatuses.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {allStatusValues.map((value: VoteStatus, i: number) => {
                    const { label } = getStatus(value);
                    return (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {label}{" "}
                          <span className="text-muted-foreground ms-2 text-xs">
                            {statusCounts.get(value) ?? 0}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Bulk action buttons */}
        {selectedRows.length > 0 &&
          (() => {
            const count = selectedRows.length;
            return (
              <div className="flex items-center gap-3">
                {/* Mark as opened */}
                <Tooltip>
                  <TooltipProvider>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="ring-input border-0 ring hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-700/10 dark:hover:bg-blue-400/10 dark:hover:text-blue-400 dark:hover:ring-blue-400/30"
                        onClick={() => setOpenDialog("open")}
                        disabled={isLoading === "update"}
                      >
                        <Clock3 className="opacity-60" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mark as opened</TooltipContent>
                  </TooltipProvider>
                </Tooltip>
                {/* Mark as in progress */}
                <Tooltip>
                  <TooltipProvider>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="ring-input border-0 ring hover:bg-orange-50 hover:text-orange-700 hover:hover:ring-orange-700/10 dark:hover:bg-orange-400/10 dark:hover:text-orange-400 dark:hover:ring-orange-400/30"
                        onClick={() => setOpenDialog("in_progress")}
                        disabled={isLoading === "update"}
                      >
                        <Construction className="opacity-60" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mark as in progress</TooltipContent>
                  </TooltipProvider>
                </Tooltip>
                {/* Mark as done */}
                <Tooltip>
                  <TooltipProvider>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="ring-input border-0 ring hover:bg-green-50 hover:text-green-700 hover:ring-green-600/20 dark:hover:bg-green-400/10 dark:hover:text-green-400 dark:hover:ring-green-400/20"
                        onClick={() => setOpenDialog("completed")}
                        disabled={isLoading === "update"}
                      >
                        <Archive className="opacity-60" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mark as done</TooltipContent>
                  </TooltipProvider>
                </Tooltip>
                {/* Delete */}
                <>
                  <Button
                    className="ring-input border-0 ring hover:bg-red-50 hover:text-red-700 hover:ring-red-700/20 dark:hover:bg-red-400/10 dark:hover:text-red-400 dark:hover:ring-red-400/30"
                    variant="outline"
                    onClick={() => setOpenDialog("delete")}
                    disabled={isLoading === "delete"}
                  >
                    <Trash size={16} className="-ms-1 opacity-60" />
                    Delete
                  </Button>
                  <AlertDialog
                    open={openDialog === "delete"}
                    onOpenChange={() => {}}
                  >
                    <AlertDialogContent>
                      <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border">
                          <CircleAlert size={16} className="opacity-80" />
                        </div>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete {count} selected{" "}
                            {count === 1 ? "row" : "rows"}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isLoading === "delete"}
                          onClick={() => setOpenDialog(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            loading={isLoading === "delete"}
                            onClick={handleBulkDelete}
                            disabled={isLoading === "delete"}
                          >
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
                {/* Status update dialogs */}
                <AlertDialog
                  open={openDialog === "open"}
                  onOpenChange={() => {}}
                >
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border">
                        <CircleAlert size={16} className="opacity-80" />
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark as opened?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark {count} selected{" "}
                          {count === 1 ? "row" : "rows"} as <b>opened</b>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setOpenDialog(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          loading={
                            isLoading === "update" && openDialog === "open"
                          }
                          onClick={() => handleBulkStatusUpdate("open")}
                          disabled={isLoading === "update"}
                        >
                          Update
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog
                  open={openDialog === "in_progress"}
                  onOpenChange={() => {}}
                >
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border">
                        <CircleAlert size={16} className="opacity-80" />
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Mark as in progress?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark {count} selected{" "}
                          {count === 1 ? "row" : "rows"} as <b>in progress</b>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setOpenDialog(null)}
                        disabled={isLoading === "update"}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          loading={
                            isLoading === "update" &&
                            openDialog === "in_progress"
                          }
                          onClick={() => handleBulkStatusUpdate("in_progress")}
                          disabled={isLoading === "update"}
                        >
                          Update
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog
                  open={openDialog === "completed"}
                  onOpenChange={() => {}}
                >
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border">
                        <CircleAlert size={16} className="opacity-80" />
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark as done?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark {count} selected{" "}
                          {count === 1 ? "row" : "rows"} as <b>done</b>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={isLoading === "update"}
                        onClick={() => setOpenDialog(null)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          loading={
                            isLoading === "update" && openDialog === "completed"
                          }
                          onClick={() => handleBulkStatusUpdate("completed")}
                          disabled={isLoading === "update"}
                        >
                          Update
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })()}
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
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
            onValueChange={(value) => handleRowsChange(Number(value))}
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
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
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
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
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
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
