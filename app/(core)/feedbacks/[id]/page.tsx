import { RiChat1Line } from "@remixicon/react";

import { AppIcon } from "@/feedbacks/components/app-icon";
import { mockFeedbacks } from "@/feedbacks/lib/mock-data";
import { capitalizeFirstLetter } from "@/lib/utils";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // For testing purporses, we match the id with the feedback using the mock data
  const feedback = mockFeedbacks.find((feedback) => feedback.id === id);

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
              value: capitalizeFirstLetter(feedback?.impact),
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
      </div>
    </div>
  );
}
