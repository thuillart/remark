import { RiChat1Line, RiChatAiLine, RiInbox2Fill } from "@remixicon/react";
import { and, eq } from "drizzle-orm";
import { parsePgArray } from "drizzle-orm/pg-core";
import { headers } from "next/headers";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageIcon } from "@/core/components/page-icon";
import { getImpactBadgeVariant, getTag } from "@/feedbacks/lib/utils";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { contact, feedback as feedbackTable } from "@/lib/db/schema";
import { FeedbackTag } from "@/lib/schema";
import { capitalizeFirstLetter } from "@/lib/utils";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [existingFeedback] = await db
    .select()
    .from(feedbackTable)
    .where(
      and(
        eq(feedbackTable.id, id),
        eq(feedbackTable.referenceId, session.user.id),
      ),
    );

  const [existingContact] = await db
    .select({ name: contact.name })
    .from(contact)
    .where(eq(contact.email, existingFeedback.from));

  console.log(JSON.stringify(existingFeedback.tags, null, 2));

  return (
    <div className="container">
      <div className="space-y-8 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <PageIcon size="lg" Icon={RiInbox2Fill} />

          <div className="w-full overflow-hidden text-center md:text-left">
            <span className="text-muted-foreground text-sm font-semibold">
              Email
            </span>
            <h1 className="w-full truncate text-xl font-bold tracking-tight">
              {existingFeedback.from}
            </h1>
          </div>
        </div>

        {/* Header */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            {
              label: "From",
              value: existingContact.name || existingFeedback.from,
            },
            {
              label: "Subject",
              value: existingFeedback.subject,
            },
            {
              label: "Impact",
              value: (
                <Badge
                  size="sm"
                  variant={getImpactBadgeVariant(existingFeedback.impact)}
                >
                  {capitalizeFirstLetter(existingFeedback.impact || "")}
                </Badge>
              ),
            },
            {
              label: "Tags",
              value: (
                <div className="flex flex-wrap gap-2">
                  {existingFeedback.tags
                    ? (typeof existingFeedback.tags === "string"
                        ? parsePgArray(existingFeedback.tags)
                        : existingFeedback.tags
                      ).map((tag) => {
                        if (!tag) return null;
                        const tagMeta = getTag(tag as FeedbackTag);
                        if (!tagMeta) return null;
                        return (
                          <Badge key={tag} size="sm" variant={tagMeta.variant}>
                            {React.createElement(tagMeta.Icon, { size: 16 })}
                            {tagMeta.label}
                          </Badge>
                        );
                      })
                    : null}
                </div>
              ),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex w-full flex-col gap-2 md:basis-1/3"
            >
              <label className="text-muted-foreground text-xs uppercase">
                {item.label}
              </label>
              <div className="flex gap-2 text-sm">{item.value}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="tab-1" className="gap-0">
          <TabsList className="bg-background h-auto -space-x-px p-0 rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-tl-lg last:rounded-tr-lg"
            >
              <RiChatAiLine size={16} className="-ms-0.5 me-1.5 opacity-60" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-tl-lg last:rounded-tr-lg"
            >
              <RiChat1Line size={16} className="-ms-0.5 me-1.5 opacity-60" />
              Original
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="tab-1"
            className="-mt-px rounded-lg rounded-tl-none border p-4 pt-5"
          >
            {existingFeedback.summary?.length === 1 ? (
              <p>{existingFeedback.summary[0]}</p>
            ) : (
              <ul className="list-disc pl-4">
                {existingFeedback.summary?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent
            value="tab-2"
            className="-mt-px rounded-lg rounded-tl-none border p-4 pt-5"
          >
            {typeof existingFeedback.text === "string" ? (
              <p>{existingFeedback.text}</p>
            ) : (
              <p>{existingFeedback.text || ""}</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
