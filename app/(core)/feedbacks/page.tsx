import { Suspense } from "react";

import { PageTitle } from "@/core/components/page-title";
import { columns } from "@/feedbacks/components/columns";
import { DataTable } from "@/feedbacks/components/data-table";
import { TableSkeleton } from "@/feedbacks/components/table-skeleton";
import { getFeedbacks } from "@/lib/db/queries";

export default function FeedbacksPage() {
  return (
    <>
      <PageTitle title="Feedbacks" />
      <Suspense fallback={<TableSkeleton />}>
        <FeedbacksTable />
      </Suspense>
    </>
  );
}

async function FeedbacksTable() {
  const result = await getFeedbacks({
    cursor: null, // We don't have it yet.
  });

  return <DataTable data={feedbacks} columns={columns} />;
}
