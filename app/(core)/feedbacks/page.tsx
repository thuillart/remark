import { Suspense } from "react";

import { PageTitle } from "@/core/components/page-title";
import { DataTable } from "@/feedbacks/components/data-table";
import { TableSkeleton } from "@/feedbacks/components/table-skeleton";

import { Logo } from "@/components/logo";
import { getFeedbacks } from "@/lib/db/queries";

export default function FeedbacksPage() {
  return (
    <>
      <PageTitle title="Feedbacks" />
      <Suspense fallback={<TableSkeleton />}>
        <FeedbacksTable />
      </Suspense>
      <div className="flex">
        <Logo.Android />
        <Logo.Apple />
        <Logo.Brave />
        <Logo.Chrome />
        <Logo.Arc />
        <Logo.Firefox />
        <Logo.Zen />
        <Logo.Edge />
        <Logo.Opera />
        <Logo.Safari />
        <Logo.Linux />
        <Logo.Windows />
      </div>
    </>
  );
}

async function FeedbacksTable() {
  "use server";
  const result = await getFeedbacks({});
  return (
    <>
      <DataTable data={result?.data?.feedbacks} />
    </>
  );
}
