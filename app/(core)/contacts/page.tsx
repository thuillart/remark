import "server-only";

import { RiGroup3Line } from "@remixicon/react";

import { EngagementChart } from "@/contacts/components/engagement-chart";
import { PageIcon } from "@/core/components/page-icon";

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

        <div className="grid w-full grid-cols-2 justify-between gap-y-4 pt-12 pb-4 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs uppercase">
              All contacts
            </div>
            <span className="text-2xl tracking-tight">0</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs uppercase">
              Paying users
            </div>
            <span className="text-2xl tracking-tight">0</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs uppercase">
              Free users
            </div>
            <span className="text-2xl tracking-tight">0</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-xs uppercase">
              Engagement
            </div>
            <div className="h-8">
              <EngagementChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
