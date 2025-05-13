import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiFilter3Line,
} from "@remixicon/react";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export function TableSkeleton() {
  return (
    <div className="container">
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="mb-4 grid grid-cols-1 flex-col gap-3 sm:grid-cols-2 sm:gap-2">
          {/* Search bar */}
          <div className="relative">
            <Input
              type="text"
              disabled
              className="peer ps-9"
              placeholder="Filter by email..."
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
              <RiFilter3Line size={16} aria-hidden="true" />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2">
            {/* Time range selector */}
            <div className="group relative">
              <Select disabled>
                <SelectTrigger className="relative ps-9">
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                    <RiCalendarLine size={16} aria-hidden="true" />
                  </div>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7-days">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Impact selector */}
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-background mb-4 overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-75.5">From</TableHead>
                <TableHead className="w-32">Impact</TableHead>
                <TableHead className="w-76">Subject</TableHead>
                <TableHead className="w-42.5">Sent</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {SKELETON_IDS.map((id) => (
                <TableRow key={id} className="hover:bg-transparent">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-lg" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 max-sm:flex-col">
          {/* Page number information */}
          <p className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
            Page <span className="text-foreground">1</span> of{" "}
            <span className="text-foreground">1</span>
          </p>

          {/* Pagination buttons */}
          <div className="grow">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled
                    aria-label="Go to previous page"
                  >
                    <RiArrowLeftLine size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button size="icon" variant="outline" disabled>
                    1
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled
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
            <Select disabled>
              <SelectTrigger className="w-fit whitespace-nowrap">
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
