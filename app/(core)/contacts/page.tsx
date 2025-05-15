import "server-only";

import { RiGroup3Line } from "@remixicon/react";
import {
  endOfWeek,
  format,
  isWithinInterval,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { Suspense } from "react";

import { DataTable } from "@/contacts/components/data-table";
import { EngagementChart } from "@/contacts/components/engagement-chart";
import { TableSkeleton } from "@/contacts/components/table-skeleton";
import { PageIcon } from "@/core/components/page-icon";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { contact, feedback } from "@/lib/db/schema";

export default function ContactsPage() {
  return (
    <div className="container">
      <div className="py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <PageIcon size="lg" Icon={RiGroup3Line} />
          <div className="text-center md:text-left">
            <span className="text-muted-foreground text-sm font-semibold">
              Segments
            </span>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          </div>
        </div>

        <Suspense fallback={<TableSkeleton />}>
          <Insights />
        </Suspense>
      </div>
    </div>
  );
}

async function Insights() {
  const { user } = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Get the total number of contacts for the current user
  const contacts = await db
    .select()
    .from(contact)
    .where(eq(contact.referenceId, user.id));

  // 2. Metadata can only contains the contact's tier
  // So we assume that if metadata is null/undefined, the contact is a free user
  // And if metadata.tier is defined, and is not "free", it's a paying user
  const paying = contacts.filter(
    (c) => c.metadata?.tier && c.metadata.tier !== "free",
  ).length;
  const free = contacts.filter(
    (c) => !c.metadata?.tier || c.metadata.tier === "free",
  ).length;

  // 3. For the chart, we count how many contacts sent feedback in the last month and make 4 slices, one for each week.
  const oneMonthAgo = subMonths(new Date(), 1);
  const feedbacks = await db
    .select()
    .from(feedback)
    .where(
      and(
        eq(feedback.referenceId, user.id),
        gte(feedback.createdAt, oneMonthAgo),
      ),
    );

  const now = new Date();
  // Get the start of the current week (Monday)
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  // Generate last 4 week ranges (from oldest to newest)
  const weekRanges = Array.from({ length: 4 }, (_, i) => {
    const start = startOfWeek(subWeeks(currentWeekStart, 3 - i), {
      weekStartsOn: 1,
    });
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return { start, end };
  });

  // Aggregate feedbacks into week buckets
  const chartData = weekRanges.map(({ start, end }) => {
    const value = feedbacks.filter((fb) =>
      isWithinInterval(fb.createdAt, { start, end }),
    ).length;
    const range = `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
    return { range, value };
  });

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-2 justify-between gap-y-4 pt-12 pb-4 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs uppercase">
            All contacts
          </div>
          <span className="text-2xl tracking-tight">{contacts.length}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs uppercase">
            Paying users
          </div>
          <span className="text-2xl tracking-tight">{paying}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs uppercase">
            Free users
          </div>
          <span className="text-2xl tracking-tight">{free}</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs uppercase">
            Engagement
          </div>
          <div className="h-8">
            <EngagementChart data={chartData} />
          </div>
        </div>
      </div>

      <DataTable data={contacts} />
    </>
  );
}
