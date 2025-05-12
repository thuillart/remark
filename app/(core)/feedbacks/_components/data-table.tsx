"use client";

import { RiChat1Line } from "@remixicon/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

import { RiFilter3Line } from "@remixicon/react";
import { useQueryState } from "nuqs";

import MultipleSelector, { Option } from "@/components/multiselect";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedbackImpact } from "@/lib/schema";

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

export function DataTable({
  data,
  columns,
}: {
  data: Feedback[];
  columns: ColumnDef<Feedback>[];
}) {
  const table = useReactTable<Feedback>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="md:not-last:w-2/10 md:last:w-1/10"
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
    </div>
  );
}
