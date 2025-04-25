import "server-only";

import { ContactsCarousel } from "@/home/components/contacts-carousel";
import { LogsCarousel } from "@/home/components/logs-carousel";
import { SegmentsCarousel } from "@/home/components/segments-carousel";

type Card = {
  title: string;
  artwork: React.ReactNode;
  description: string;
};

const cards: Card[] = [
  {
    title: "Logs.",
    artwork: <LogsCarousel />,
    description: "As soon as an event happens.",
  },
  {
    title: "Segments.",
    artwork: <SegmentsCarousel />,
    description: "By tier, or any way you want.",
  },
  {
    title: "Contacts.",
    artwork: <ContactsCarousel />,
    description: "See who's behind every feedback.",
  },
];

function Tools() {
  return (
    <section className="container">
      <div className="py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-18">
          <div className="top-38 mb-12 space-y-3 self-start md:sticky md:mb-0 md:ml-6">
            <h2 className="font-semibold text-4xl/14 tracking-tight">
              Developer-first.
            </h2>
            <p className="font-medium text-muted-foreground text-xl tracking-tight">
              Our goal is to create the feedback platform we&apos;ve always
              wished we had — one that just works.
            </p>
          </div>
          <div className="flex flex-col gap-17">
            {cards.map(({ title, artwork, description }) => (
              <ToolCard
                key={title}
                title={title}
                artwork={artwork}
                description={description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolCard({ title, artwork, description }: Card) {
  return (
    <div className="space-y-8">
      <div className="relative h-50 overflow-hidden rounded-2xl border md:h-64">
        {artwork}
      </div>
      <p className="flex flex-col items-baseline gap-3 text-muted-foreground md:flex-row">
        <span className="font-semibold text-2xl/[1.05] text-foreground tracking-tight">
          {title}
        </span>
        {description}
      </p>
    </div>
  );
}

export { Tools };
