import { Skeleton } from "@/components/ui/skeleton";

export function PricingSkeleton() {
  return (
    <>
      <Skeleton className="h-97.5 rounded-2xl border" />
      <Skeleton className="h-97.5 rounded-2xl border" />
      <Skeleton className="h-97.5 rounded-2xl border" />
    </>
  );
}
