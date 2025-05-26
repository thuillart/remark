"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  AnimatePresence,
  type Transition,
  type Variants,
  motion,
} from "motion/react";
import React from "react";

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

const pingVariants: Variants = {
  animate: {
    scale: [1, 2, 1],
    opacity: [0, 0.25, 0],
  },
};

const pingTransition = (index: number): Transition => ({
  ease: "easeOut",
  delay: index * 50,
  repeat: Infinity,
  duration: 3,
  repeatDelay: 0,
});

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
      className="before:from-background after:from-background relative before:absolute before:inset-0 before:left-auto before:z-1 before:w-4 before:bg-gradient-to-l before:to-transparent after:absolute after:inset-0 after:right-auto after:z-1 after:w-4 after:bg-gradient-to-r after:to-transparent before:md:w-10 after:md:w-10"
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="h-50 py-6 md:h-64 md:py-10">
        <AnimatePresence>
          {segments.map(({ title, count, items }, index) => (
            <CarouselItem
              key={title}
              className="basis-[calc(100%-3rem)] md:basis-[calc(100%-5rem)]"
            >
              <motion.div
                key={title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border px-6 py-5 text-xs",
                  current - 1 !== index && "shadow-none",
                )}
              >
                <div className="pointer-events-none absolute inset-0 -z-1">
                  <div
                    className={cn(
                      "from-muted-foreground to-muted absolute -top-3 -right-3 aspect-square w-28 rounded-full bg-gradient-to-b opacity-75 blur-2xl",
                    )}
                  />
                  <div className="from-background/5 absolute inset-0 bg-gradient-to-tl" />
                  <div className="from-background/60 absolute inset-0 bg-gradient-to-b backdrop-filter" />
                </div>

                <div className="space-y-1.5 md:space-y-3">
                  <h3 className="text-xs font-medium tracking-wide uppercase">
                    {title}
                  </h3>
                  <p className="text-2xl/6 font-medium md:text-3xl/6">
                    {count}%
                  </p>
                </div>

                <motion.div className="mt-auto">
                  {items.map(({ title, count }, index) => (
                    <React.Fragment key={title}>
                      <div
                        key={title}
                        className="text-slate-12 flex w-full items-center justify-between pt-3 not-last:pb-3"
                      >
                        <div className="inline-flex items-center gap-3">
                          <div className="relative size-2">
                            <div className="bg-muted-foreground/50 absolute inset-0 rounded-full" />
                            {["ping-outer", "ping-inner"].map((key) => (
                              <motion.div
                                key={key}
                                animate="animate"
                                variants={pingVariants}
                                className="bg-muted-foreground/50 absolute inset-0 rounded-full"
                                transition={pingTransition(index)}
                              />
                            ))}
                          </div>
                          <span>{title}</span>
                        </div>
                        <span className="opacity-80">{count}</span>
                      </div>

                      {index !== items.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </motion.div>
              </motion.div>
            </CarouselItem>
          ))}
        </AnimatePresence>
      </CarouselContent>
    </Carousel>
  );
}
