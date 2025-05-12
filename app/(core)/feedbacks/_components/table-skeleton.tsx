import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export function TableSkeleton() {
  return (
    <div className="container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/10">From</TableHead>
            <TableHead className="w-2/10">Impact</TableHead>
            <TableHead className="w-2/10">Sent at</TableHead>
            <TableHead className="w-1/10 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {SKELETON_IDS.map((id) => (
            <TableRow key={id} className="h-10">
              <TableCell>
                <Skeleton className="h-3 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-2 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-2 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-2 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="mx-auto h-2 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
