"use client";

import { RiKeyLine } from "@remixicon/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useApiKeyStore } from "@/api-keys/lib/store";
import type { ApiKey } from "@/api-keys/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/core/components/empty-state";

export function DataTable({
  data,
  columns,
}: {
  data: ApiKey[];
  columns: ColumnDef<ApiKey>[];
}) {
  const { setOpen } = useApiKeyStore();

  const table = useReactTable<ApiKey>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (table.getRowModel().rows.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title="You don't have any API keys yet"
          icons={[RiKeyLine, RiKeyLine, RiKeyLine]}
          description="API Keys are randomly generated alpha-numeric strings that are used to send feedbacks."
          action={{
            label: "Create API Key",
            onClick: () => setOpen("create"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="relative w-full overflow-x-auto overflow-y-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="md:not-last:w-2/10 md:last:w-1/10 md:last:text-center"
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
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-transparent"
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
