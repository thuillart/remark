import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageTitle } from "@/core/components/page-title";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export function TableSkeleton() {
  return (
    <>
      <PageTitle title="Feedbacks" />

      <div className="mx-auto w-full px-6 md:max-w-5xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/10">Name</TableHead>
              <TableHead className="w-2/10">Starts by</TableHead>
              <TableHead className="w-2/10">Last request</TableHead>
              <TableHead className="w-2/10">Created</TableHead>
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
    </>
  );
}
