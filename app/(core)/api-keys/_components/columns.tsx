"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  Edit3Icon,
  LockKeyholeIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";

import { useApiKeyStore } from "@/api-keys/lib/store";
import type { ApiKey } from "@/api-keys/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const isActive = row.original.lastRequest;

      return (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg border border-border p-0.5">
            <div
              className={cn(
                "flex size-full items-center justify-center rounded-md border",
                isActive
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-border bg-foreground/5 text-muted-foreground",
              )}
            >
              <LockKeyholeIcon size={16} className="opacity-80" />
            </div>
          </div>
          {row.original.name}
        </div>
      );
    },
  },
  {
    accessorKey: "start",
    header: "Starts with",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.start ?? ""}</Badge>
    ),
  },
  {
    accessorKey: "lastRequest",
    header: "Last request",
    cell: ({ row }) =>
      row.original.lastRequest
        ? capitalizeFirstLetter(
            formatDistanceToNow(row.original.lastRequest, {
              addSuffix: true,
            }),
          )
        : "Not used yet",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
        return "Invalid date";
      }
      return capitalizeFirstLetter(
        formatDistanceToNow(createdAt, {
          addSuffix: true,
        }),
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell apiKeyId={row.original.id} />,
  },
];

const ActionsCell = ({ apiKeyId }: { apiKeyId: string }) => {
  const { setOpen, setSelectedApiKeyId } = useApiKeyStore();

  return (
    <div className="text-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-7">
            <MoreHorizontalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-42">
          <DropdownMenuItem
            onClick={() => {
              setSelectedApiKeyId(apiKeyId);
              setOpen("update");
            }}
          >
            <Edit3Icon size={16} />
            Edit API key
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setSelectedApiKeyId(apiKeyId);
              setOpen("delete");
            }}
          >
            <Trash2Icon size={16} />
            Delete API key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
