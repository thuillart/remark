import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Suspense } from "react";

import { PageTitle } from "@/core/components/page-title";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { vote } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";

export default function VotesPage() {
  return (
    <>
      <PageTitle title="Votes" />
      <main className="container">
        <Suspense>
          <SuspensedTable />
        </Suspense>
      </main>
    </>
  );
}

async function SuspensedTable() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return redirect("/sign-in");
  }

  const votes = await db
    .select()
    .from(vote)
    .where(eq(vote.referenceId, user.id));

  return (
    <DataTable key={JSON.stringify(votes.map((v) => v.id))} data={[...votes]} />
  );
}
