"use client";

import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Log = {
  uuid: string;
  status: 200 | 403 | 500;
  method: "POST" | "PATCH" | "DELETE";
};

const generateLogs = (): Log[] => [
  {
    uuid: crypto.randomUUID(),
    status: 403,
    method: "POST",
  },
  {
    uuid: crypto.randomUUID(),
    status: 200,
    method: "POST",
  },
  {
    uuid: crypto.randomUUID(),
    status: 500,
    method: "PATCH",
  },
  {
    uuid: crypto.randomUUID(),
    status: 200,
    method: "DELETE",
  },
  {
    uuid: crypto.randomUUID(),
    status: 403,
    method: "PATCH",
  },
  {
    uuid: crypto.randomUUID(),
    status: 200,
    method: "POST",
  },
];

export function LogsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [logs, setLogs] = React.useState<Log[]>([]);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    // Hydrate logs on mount
    setLogs(generateLogs());
  }, []);

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
      orientation="vertical"
      className="select-none before:absolute before:inset-0 before:top-auto before:z-1 before:h-4 before:bg-gradient-to-t before:from-background before:to-transparent after:absolute after:inset-0 after:bottom-auto after:z-1 after:h-4 after:bg-gradient-to-b after:from-background after:to-transparent after:md:h-10 before:md:h-10"
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="-mt-1.5 md:-mt-2 h-50 px-6 md:h-64 md:px-10">
        <AnimatePresence>
          {logs.map((log, index) => (
            <CarouselItem
              key={log.uuid}
              className="basis-10 pt-2 md:basis-14 md:pt-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-2 py-2 transition-shadow",
                  current - 1 !== index && "shadow-none",
                )}
              >
                <Badge
                  variant={
                    log.status === 500
                      ? "destructive"
                      : log.status === 200
                        ? "green"
                        : "yellow"
                  }
                >
                  {log.status}
                </Badge>

                <div className="overflow-hidden">
                  <p className="w-full truncate font-mono text-muted-foreground text-sm">
                    {`{ id: ${log.uuid} }`}
                  </p>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </AnimatePresence>
      </CarouselContent>
    </Carousel>
  );
}
