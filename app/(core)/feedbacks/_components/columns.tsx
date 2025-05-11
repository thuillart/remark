import { RiChat1Line } from "@remixicon/react";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Feedback } from "@/feedbacks/lib/schema";

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      const email = row.original.from;
      return (
        <div className="flex items-center gap-2">
          <div className="border-border size-8 rounded-lg border p-0.5">
            <div className="flex size-full items-center justify-center rounded-md border bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-500/20">
              <RiChat1Line size={16} className="opacity-60" />
            </div>
          </div>
          {email}
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
        return <Badge variant="destructive">{impact}</Badge>;
      }

      if (impact === "major") {
        return <Badge variant="warning">{impact}</Badge>;
      }

      return <Badge>{impact}</Badge>;
    },
  },
];
