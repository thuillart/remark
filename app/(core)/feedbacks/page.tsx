import React from "react";

import { PageTitle } from "@/core/components/page-title";
import { DataTable } from "@/feedbacks/components/data-table";
import { TableSkeleton } from "@/feedbacks/components/table-skeleton";
import { getFeedbacks } from "@/lib/db/queries";

export default function FeedbacksPage() {
  return (
    <>
      <PageTitle title="Feedbacks" />
      <React.Suspense fallback={<TableSkeleton />}>
        <FeedbacksTable />
      </React.Suspense>
    </>
  );
}

async function FeedbacksTable() {
  "use server";
  const result = await getFeedbacks({ cursor: null });
  return (
    <>
      <DataTable data={result?.data?.feedbacks} />
    </>
  );
}
