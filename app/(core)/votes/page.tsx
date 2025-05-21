import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { PageTitle } from "@/core/components/page-title";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { vote } from "@/lib/db/schema";
import { Suspense } from "react";

export default function VotesPage() {
  return (
    <>
      <PageTitle title="Votes" />
      <main className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <VotesTable />
        </Suspense>
      </main>
    </>
  );
}

async function VotesTable() {
  "use server";
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const [votes] = await db
    .select()
    .from(vote)
    .where(eq(vote.referenceId, user?.id));

  return <div>{JSON.stringify(votes ?? "no votes")}</div>;
}
