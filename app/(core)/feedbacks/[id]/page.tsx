import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { parsePgArray } from "drizzle-orm/pg-core";
import {
  BadgeCheck,
  BotMessageSquare,
  Gamepad2,
  Link,
  MessageSquare,
  Monitor,
  Refrigerator,
  SendHorizonal,
  Smartphone,
  Tablet,
  TvMinimal,
  Watch,
} from "lucide-react";
import { headers } from "next/headers";
import React from "react";

import { Logo } from "@/components/logo";
import { TextShimmer } from "@/components/text-shimmer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageIcon } from "@/core/components/page-icon";
import { DotPattern } from "@/feedbacks/id/components/dot-pattern";
import { getImpact, getTag } from "@/feedbacks/lib/utils";
import { auth } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import {
  contact as contactTable,
  feedback as feedbackTable,
} from "@/lib/db/schema";
import { FeedbackTag } from "@/lib/schema";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [feedback] = await db
    .select()
    .from(feedbackTable)
    .where(
      and(
        eq(feedbackTable.id, id),
        eq(feedbackTable.referenceId, session.user.id),
      ),
    );

  if (!feedback) {
    return (
      <div className="container">
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Feedback not found</p>
        </div>
      </div>
    );
  }

  const [contact] = await db
    .select({ name: contactTable.name })
    .from(contactTable)
    .where(eq(contactTable.email, feedback.from));

  const feedbackTags = feedback.tags
    ? (typeof feedback.tags === "string"
        ? parsePgArray(feedback.tags)
        : feedback.tags
      ).filter(Boolean)
    : [];

  const headerItems = [
    {
      label: "From",
      value: contact.name || feedback.from,
    },
    {
      label: "Subject",
      value: feedback.subject,
    },
    {
      label: "Impact",
      value: (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={getImpact(feedback.impact).variant}>
                {getImpact(feedback.impact).label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <TextShimmer>{`${APP_NAME} AI`}</TextShimmer>{" "}
              {getImpact(feedback.impact).description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      label: "Tags",
      value: (
        <div className="flex flex-wrap gap-2">
          {feedbackTags.map((tagValue: FeedbackTag) => {
            const tag = getTag(tagValue);
            if (!tag) return null;
            return (
              <Badge key={tagValue} variant={tag.variant}>
                {React.createElement(tag.Icon)}
                {tag.label}
              </Badge>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="space-y-8 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <PageIcon size="lg" Icon={MessageSquare} />

          <div className="w-full overflow-hidden text-center md:text-left">
            <span className="text-muted-foreground text-sm font-semibold">
              Email
            </span>
            <h1 className="w-full truncate text-xl font-bold tracking-tight">
              {feedback.from}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {headerItems.map((item) => (
            <div
              key={item.label}
              className="flex w-full flex-col gap-2 md:basis-1/3"
            >
              <label className="text-muted-foreground text-xs uppercase">
                {item.label}
              </label>
              <div className="flex text-sm/6">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <label className="text-muted-foreground text-xs uppercase">
            Flow chart
          </label>
          <div className="relative w-full overflow-x-auto rounded-md border p-8">
            <div className="relative mx-auto flex w-fit gap-12">
              <span className="bg-border pointer-events-none absolute top-1/2 left-8 mt-0.5 h-0.5 w-[calc(100%-4rem)] -translate-y-8 select-none" />

              {feedback.metadata?.device && (
                <div className="relative z-1 flex min-w-24 flex-col items-center justify-center gap-2">
                  <div className="group flex cursor-default flex-col items-center justify-center gap-2 rounded-lg outline-none">
                    <div className="bg-background relative z-2 flex size-10 shrink-0 items-center justify-center rounded-lg border">
                      {feedback.metadata?.device === "mobile" && (
                        <Smartphone className="opacity-80" />
                      )}
                      {feedback.metadata?.device === "tablet" && (
                        <Tablet className="opacity-80" />
                      )}
                      {feedback.metadata?.device === "desktop" && (
                        <Monitor className="opacity-80" />
                      )}
                      {feedback.metadata?.device === "console" && (
                        <Gamepad2 className="opacity-80" />
                      )}
                      {feedback.metadata?.device === "smarttv" && (
                        <TvMinimal className="opacity-80" />
                      )}
                      {feedback.metadata?.device === "wearable" && (
                        <Watch className="opacity-80" />
                      )}
                      {feedback.metadata?.device === "embedded" && (
                        <Refrigerator className="opacity-80" />
                      )}
                    </div>
                    <Badge variant="secondary">Device</Badge>
                  </div>
                  <span className="text-muted-foreground text-center text-xs font-normal">
                    {feedback.metadata?.device === "mobile" && "Mobile"}
                    {feedback.metadata?.device === "tablet" && "Tablet"}
                    {feedback.metadata?.device === "desktop" && "Desktop"}
                    {feedback.metadata?.device === "console" && "Console"}
                    {feedback.metadata?.device === "smarttv" && "Smart TV"}
                    {feedback.metadata?.device === "wearable" && "Wearable"}
                    {feedback.metadata?.device === "embedded" && "Embedded"}
                  </span>
                </div>
              )}

              {feedback.metadata?.os && (
                <div className="relative z-1 flex min-w-24 flex-col items-center justify-center gap-2">
                  <div className="group flex cursor-default flex-col items-center justify-center gap-2 rounded-lg outline-none">
                    <div className="bg-background relative z-2 flex size-10 shrink-0 items-center justify-center rounded-lg border">
                      {feedback.metadata?.os === "Windows" && (
                        <Logo.Windows className="opacity-80" />
                      )}
                      {feedback.metadata?.os === "macOS" && (
                        <Logo.Apple className="mb-0.5 ml-px opacity-80" />
                      )}
                      {feedback.metadata?.os === "iOS" && (
                        <Logo.Apple className="opacity-80" />
                      )}
                      {feedback.metadata?.os === "Android" && (
                        <Logo.Android className="opacity-80" />
                      )}
                      {feedback.metadata?.os === "Linux" && (
                        <Logo.Linux className="opacity-80" />
                      )}
                      {feedback.metadata?.os === "ChromeOS" && (
                        <Logo.Chrome className="opacity-80" />
                      )}
                    </div>
                    <Badge variant="secondary">OS</Badge>
                  </div>
                  <span className="text-muted-foreground text-center text-xs font-normal">
                    {feedback.metadata?.os}
                  </span>
                </div>
              )}

              {feedback.metadata?.browser && (
                <div className="relative z-1 flex min-w-24 flex-col items-center justify-center gap-2">
                  <div className="group flex cursor-default flex-col items-center justify-center gap-2 rounded-lg outline-none">
                    <div className="bg-background relative z-2 flex size-10 shrink-0 items-center justify-center rounded-lg border">
                      {feedback.metadata?.browser === "Chrome" && (
                        <Logo.Chrome className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Firefox" && (
                        <Logo.Firefox className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Safari" && (
                        <Logo.Safari className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Edge" && (
                        <Logo.Edge className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Opera" && (
                        <Logo.Opera className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Brave" && (
                        <Logo.Brave className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Arc" && (
                        <Logo.Arc className="opacity-80" />
                      )}
                      {feedback.metadata?.browser === "Zen" && (
                        <Logo.Zen className="opacity-80" />
                      )}
                    </div>
                    <Badge variant="secondary">Browser</Badge>
                  </div>
                  <span className="text-muted-foreground text-center text-xs">
                    {feedback.metadata?.browser}
                  </span>
                </div>
              )}

              {feedback.metadata?.path && (
                <div className="relative z-1 flex min-w-24 flex-col items-center justify-center gap-2">
                  <div className="group flex cursor-default flex-col items-center justify-center gap-2 rounded-lg outline-none">
                    <div className="bg-background relative z-2 flex size-10 shrink-0 items-center justify-center rounded-lg border">
                      <Link className="opacity-80" />
                    </div>
                    <Badge variant="secondary">Page</Badge>
                  </div>
                  <span className="text-muted-foreground text-center text-xs">
                    {feedback.metadata?.path.split("/").pop()}
                  </span>
                </div>
              )}

              <div className="relative z-1 flex min-w-24 flex-col items-center justify-center gap-2">
                <div className="group flex cursor-default flex-col items-center justify-center gap-2 rounded-lg outline-none">
                  <div className="bg-background relative z-2 flex size-10 shrink-0 items-center justify-center rounded-lg border">
                    <SendHorizonal size={20} className="ml-px opacity-80" />
                  </div>
                  <Badge variant="secondary">Sent</Badge>
                </div>
                <span className="text-muted-foreground text-center text-xs">
                  {format(feedback.createdAt, "MMM d, h:mm a")}
                </span>
              </div>

              <div className="relative z-1 flex min-w-24 flex-col items-center justify-center gap-2">
                <div className="group flex cursor-default flex-col items-center justify-center gap-2 rounded-lg outline-none">
                  <div className="bg-background relative z-2 flex size-10 shrink-0 items-center justify-center rounded-lg border">
                    <BadgeCheck
                      size={20}
                      className="ml-px text-green-700 opacity-80 dark:text-green-400"
                    />
                  </div>
                  <Badge variant="green">Processed</Badge>
                </div>
                <span className="text-muted-foreground text-center text-xs">
                  {format(feedback.createdAt, "MMM d, h:mm a")}
                </span>
              </div>
            </div>
            <DotPattern cy={1} cr={1} cx={1} y={7} x={6} />
          </div>
        </div>

        <Tabs defaultValue="tab-1" className="gap-0">
          <TabsList className="bg-background h-auto -space-x-px p-0 rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-tl-lg last:rounded-tr-lg"
            >
              <BotMessageSquare
                size={16}
                className="-ms-0.5 me-1.5 opacity-60"
              />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-tl-lg last:rounded-tr-lg"
            >
              <MessageSquare size={16} className="-ms-0.5 me-1.5 opacity-60" />
              Original
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="tab-1"
            className="-mt-px rounded-lg rounded-tl-none border p-4 pt-5"
          >
            {feedback.summary?.length === 1 ? (
              <p>{feedback.summary[0]}</p>
            ) : (
              <ul className="list-disc pl-4">
                {feedback.summary?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent
            value="tab-2"
            className="-mt-px rounded-lg rounded-tl-none border p-4 pt-5"
          >
            <p>{feedback.text || ""}</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
