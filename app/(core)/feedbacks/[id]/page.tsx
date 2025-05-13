import { RiChat1Line, RiChatAiLine } from "@remixicon/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppIcon } from "@/feedbacks/components/app-icon";
// import { mockFeedbacks } from "@/feedbacks/lib/mock-data";
import { getFeedbackById } from "@/lib/db/queries";
import { capitalizeFirstLetter } from "@/lib/utils";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // // For testing purporses, we match the id with the feedback using the mock data
  // const feedback = mockFeedbacks.find((feedback) => feedback.id === id);

  const result = await getFeedbackById({ id });

  if (result?.data.failure) {
    return <div>Error: {result.data.failure}</div>;
  }

  const feedback = result?.data?.feedback;

  return (
    <div className="container">
      <div className="space-y-8 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <AppIcon size="lg" Icon={RiChat1Line} />

          <div className="w-full overflow-hidden text-center md:text-left">
            <span className="text-muted-foreground text-sm font-semibold">
              Email
            </span>
            <h1 className="w-full truncate text-xl font-bold tracking-tight">
              {feedback?.from}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap">
          {[
            {
              label: "From",
              value: feedback?.from,
            },
            {
              label: "Subject",
              value: feedback?.subject,
            },
            {
              label: "Impact",
              value: capitalizeFirstLetter(feedback?.impact || ""),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex w-full flex-col gap-2 md:basis-1/3"
            >
              <label className="text-muted-foreground text-xs uppercase">
                {item.label}
              </label>
              <div className="flex gap-2">
                <span className="text-sm">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="tab-1" className="gap-0">
          <TabsList className="bg-background h-auto -space-x-px p-0 rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-tl last:rounded-tr"
            >
              <RiChatAiLine size={16} className="-ms-0.5 me-1.5 opacity-60" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-tl last:rounded-tr"
            >
              <RiChat1Line size={16} className="-ms-0.5 me-1.5 opacity-60" />
              Original
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tab-1" className="-mt-px border p-4">
            <p className="prose text-foreground whitespace-pre-line">
              {feedback?.summary}
            </p>
          </TabsContent>
          <TabsContent value="tab-2" className="-mt-px border p-4">
            <p className="prose text-foreground whitespace-pre-line">
              {feedback?.text}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
