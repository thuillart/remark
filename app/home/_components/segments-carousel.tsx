"use client";

import Autoplay from "embla-carousel-autoplay";
import React, { Fragment } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const segments = [
  {
    title: "Engagement",
    count: 41,
    gradientColor: "from-cyan-400 to-cyan-500",
    items: [
      {
        title: "Free",
        count: 1304,
        backgroundColor: "var(--color-sky-400)",
      },
      {
        title: "Plus",
        count: 304,
        backgroundColor: "var(--color-purple-400)",
      },
    ],
  },
  {
    title: "Source",
    count: 98,
    gradientColor: "from-green-400 to-green-500",
    items: [
      {
        title: "Popover",
        count: 408,
        backgroundColor: "var(--color-green-400)",
      },
      {
        title: "Form",
        count: 10,
        backgroundColor: "var(--color-blue-400)",
      },
    ],
  },
  {
    title: "Requests",
    count: 14,
    gradientColor: "from-red-400 to-red-500",
    items: [
      {
        title: "Free",
        count: 30,
        backgroundColor: "var(--color-red-400)",
      },
      {
        title: "Plus",
        count: 3,
        backgroundColor: "var(--color-yellow-400)",
      },
    ],
  },
];

export function SegmentsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnMouseEnter: true,
      stopOnInteraction: true,
    }),
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      opts={{ loop: true, align: "center" }}
      setApi={setApi}
      plugins={[plugin.current]}
      className="relative before:absolute before:inset-0 before:left-auto before:z-1 before:w-4 before:bg-gradient-to-l before:from-background before:to-transparent after:absolute after:inset-0 after:right-auto after:z-1 after:w-4 after:bg-gradient-to-r after:from-background after:to-transparent after:md:w-10 before:md:w-10"
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="h-50 py-6 md:h-64 md:py-10">
        {segments.map(({ title, count, items, gradientColor }, index) => (
          <CarouselItem
            key={title}
            className="basis-[calc(100%-3rem)] md:basis-[calc(100%-5rem)]"
          >
            <div
              key={title}
              className={cn(
                "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border px-6 py-5 text-xs",
                current - 1 !== index && "shadow-none",
              )}
            >
              <div className="-z-1 pointer-events-none absolute inset-0">
                <div
                  className={cn(
                    "-right-3 -top-3 absolute aspect-square w-28 rounded-full bg-gradient-to-b opacity-75 blur-2xl",
                    gradientColor,
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-background/5" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 backdrop-filter" />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium uppercase tracking-wide">{title}</h3>
                <p className="font-medium text-3xl/6">{count}%</p>
              </div>

              <div className="mt-auto">
                {items.map(({ title, count, backgroundColor }, index) => (
                  <Fragment key={title}>
                    <div
                      key={title}
                      className="flex w-full items-center justify-between pt-3 not-last:pb-3 text-slate-12"
                    >
                      <div className="inline-flex items-center gap-3">
                        <div className="relative size-2">
                          <div
                            style={{ backgroundColor }}
                            className="absolute inset-0 rounded-full"
                          />
                        </div>
                        <span>{title}</span>
                      </div>
                      <span className="opacity-80">{count}</span>
                    </div>

                    {index !== items.length - 1 && <hr />}
                  </Fragment>
                ))}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
