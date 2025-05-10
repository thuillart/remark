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

const logs: Log[] = [
  {
    uuid: "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d",
    status: 403,
    method: "POST",
  },
  {
    uuid: "f5e4d3c2-b1a0-4f3e-8d7c-6b5a4c3d2e1f",
    status: 200,
    method: "POST",
  },
  {
    uuid: "9e8d7c6b-5a4c-3d2e-1f0a-9b8c7d6e5f4a",
    status: 500,
    method: "PATCH",
  },
  {
    uuid: "3c2d1e0f-9a8b-7c6d-5e4f-3a2b1c0d9e8f",
    status: 200,
    method: "DELETE",
  },
  {
    uuid: "7b6a5c4d-3e2f-1a0b-9c8d-7e6f5a4b3c2d",
    status: 403,
    method: "PATCH",
  },
  {
    uuid: "2e1f0a9b-8c7d-6e5f-4a3b-2c1d0e9f8a7b",
    status: 200,
    method: "POST",
  },
];

export function LogsCarousel() {
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
      orientation="vertical"
      className="select-none before:absolute before:inset-0 before:top-auto before:z-1 before:h-4 before:bg-gradient-to-t before:from-background before:to-transparent after:absolute after:inset-0 after:bottom-auto after:z-1 after:h-4 after:bg-gradient-to-b after:from-background after:to-transparent after:md:h-10 before:md:h-10"
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="-mt-1.5 md:-mt-2 h-52 px-6 md:h-64 md:px-10">
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
                <Badge variant="secondary">{log.status}</Badge>
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
