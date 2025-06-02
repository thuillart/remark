// import { eq } from "drizzle-orm";
import { Suspense } from "react";

import { PageTitle } from "@/core/components/page-title";
// import { db } from "@/lib/db/drizzle";
// import { vote } from "@/lib/db/schema";
import { Vote } from "@/votes/lib/schema";
import { DataTable } from "./_components/data-table";

// Fake data for development
const fakeVotes: Vote[] = [
  {
    id: "1",
    title: "Add keyboard shortcuts",
    description:
      "Power users are requesting keyboard shortcuts to speed up their workflow. Common actions like creating new feedback, switching views, and applying filters should be accessible via keyboard.",
    count: 42,
    browsers: ["Chrome", "Firefox", "Edge"],
    operatingSystems: ["Windows", "macOS"],
    devices: ["desktop"],
    tags: ["feature_request"],
    impact: "major",
    referenceId: "user1",
    status: "in_progress",
    feedbackIds: ["feedback1", "feedback2"],
    archived: false,
    createdAt: new Date("2025-05-28T14:30:00Z"),
    updatedAt: new Date("2025-06-01T09:15:00Z"),
  },
  {
    id: "2",
    title: "Fix image upload on mobile",
    description:
      "Users report that image uploads fail on mobile devices when selecting multiple files. The upload progress indicator also freezes occasionally.",
    count: 35,
    browsers: ["Safari", "Chrome"],
    operatingSystems: ["iOS", "Android"],
    devices: ["mobile"],
    tags: ["bug"],
    impact: "major",
    referenceId: "user1",
    status: "reviewing",
    feedbackIds: ["feedback3", "feedback4"],
    archived: false,
    createdAt: new Date("2025-05-30T11:20:00Z"),
    updatedAt: new Date("2025-06-02T08:45:00Z"),
  },
  {
    id: "3",
    title: "Add export to PDF",
    description:
      "Teams need to export feedback reports to PDF for sharing with stakeholders. Should include all comments, attachments, and maintain formatting.",
    count: 28,
    browsers: ["Chrome", "Firefox", "Edge"],
    operatingSystems: ["Windows", "macOS"],
    devices: ["desktop"],
    tags: ["feature_request"],
    impact: "major",
    referenceId: "user1",
    status: "planned",
    feedbackIds: ["feedback5"],
    archived: false,
    createdAt: new Date("2025-05-31T16:00:00Z"),
    updatedAt: new Date("2025-06-02T10:30:00Z"),
  },
  {
    id: "4",
    title: "Improve search filters",
    description:
      "Current search filters are too basic. Users want to combine multiple criteria and save their favorite filter combinations for quick access.",
    count: 31,
    browsers: ["Chrome", "Firefox", "Safari"],
    operatingSystems: ["Windows", "macOS"],
    devices: ["desktop"],
    tags: ["ux"],
    impact: "major",
    referenceId: "user1",
    status: "in_progress",
    feedbackIds: ["feedback6", "feedback7"],
    archived: false,
    createdAt: new Date("2025-06-01T09:45:00Z"),
    updatedAt: new Date("2025-06-02T14:20:00Z"),
  },
  {
    id: "5",
    title: "Add email notifications",
    description:
      "Users want to receive email notifications when someone comments on their feedback or when status changes occur. Should include notification preferences.",
    count: 45,
    browsers: ["Chrome", "Firefox", "Safari", "Edge"],
    operatingSystems: ["Windows", "macOS", "Linux"],
    devices: ["desktop", "mobile"],
    tags: ["feature_request"],
    impact: "major",
    referenceId: "user1",
    status: "planned",
    feedbackIds: ["feedback8", "feedback9"],
    archived: false,
    createdAt: new Date("2025-06-02T08:30:00Z"),
    updatedAt: new Date("2025-06-02T16:57:00Z"),
  },
  {
    id: "6",
    title: "Remove deprecated webhook endpoints",
    description:
      "The v1 webhook endpoints are causing confusion and should be removed. All users have been migrated to v2 endpoints. Need to update documentation and add proper deprecation notices.",
    count: 8,
    browsers: ["Chrome", "Firefox", "Edge"],
    operatingSystems: ["Windows", "macOS", "Linux"],
    devices: ["desktop"],
    tags: ["dx", "security", "compliance"],
    impact: "minor",
    referenceId: "user1",
    status: "closed",
    feedbackIds: ["feedback12"],
    archived: true,
    createdAt: new Date("2024-03-10T08:00:00Z"),
    updatedAt: new Date("2024-03-14T15:00:00Z"),
  },
  {
    id: "7",
    title: "Add support for custom domains in feedback portal",
    description:
      "Enterprise customers need the ability to host the feedback portal on their own domains with proper SSL certificates and custom branding.",
    count: 19,
    browsers: ["Chrome", "Firefox", "Safari", "Edge"],
    operatingSystems: ["Windows", "macOS"],
    devices: ["desktop", "mobile"],
    tags: ["feature_request", "security", "compliance"],
    impact: "major",
    referenceId: "user1",
    status: "planned",
    feedbackIds: ["feedback13", "feedback14"],
    archived: false,
    createdAt: new Date("2024-03-16T13:45:00Z"),
    updatedAt: new Date("2024-03-19T10:30:00Z"),
  },
  {
    id: "8",
    title: "Fix accessibility issues in feedback form",
    description:
      "Screen reader users report navigation issues in the feedback form. Specific problems with ARIA labels and keyboard navigation in the rich text editor.",
    count: 12,
    browsers: ["Chrome", "Firefox", "Safari"],
    operatingSystems: ["Windows", "macOS"],
    devices: ["desktop", "mobile"],
    tags: ["bug", "ux", "a11y"],
    impact: "major",
    referenceId: "user1",
    status: "in_progress",
    feedbackIds: ["feedback15"],
    archived: false,
    createdAt: new Date("2024-03-20T09:00:00Z"),
    updatedAt: new Date("2024-03-20T15:45:00Z"),
  },
];

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
  // const session = await auth.api.getSession({ headers: await headers() });
  // const user = session?.user;

  // Use fake data for development
  const votes = fakeVotes;

  // Real data fetching (commented for development)
  // const votes = await db
  //   .select()
  //   .from(vote)
  //   .where(eq(vote.referenceId, user.id));

  return (
    <div className="container">
      <DataTable data={votes} />
    </div>
  );
}
