import { Suspense } from "react";

import { PageTitle } from "@/core/components/page-title";
import { DataTable } from "@/feedbacks/components/data-table";
import { TableSkeleton } from "@/feedbacks/components/table-skeleton";
// import { mockFeedbacks } from "./_lib/mock-data";
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
  "use server";
  const result = await getFeedbacks({});
  return (
    <>
      <DataTable
        data={result?.data?.feedbacks}
        // data={mockFeedbacks}
      />
    </>
  );
}
