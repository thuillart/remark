import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Suspense } from "react";

import { PageTitle } from "@/core/components/page-title";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { vote } from "@/lib/db/schema";
import { DataTable } from "@/votes/components/data-table";

export default function VotesPage() {
  return (
    <>
      <PageTitle title="Votes" />
      <Suspense>
        <Table />
      </Suspense>
    </>
  );
}

async function Table() {
  const session = await auth.api.getSession({ headers: await headers() });

  const votes = await db
    .select()
    .from(vote)
    .where(eq(vote.referenceId, session.user.id));

  return <DataTable data={votes} />;
}
