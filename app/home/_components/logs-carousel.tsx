"use client";

import Autoplay from "embla-carousel-autoplay";
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
  code: 200 | 403 | 500;
  type: "POST" | "PATCH" | "DELETE";
  uuid: string;
};

const logs: Log[] = [
  {
    code: 403,
    type: "POST",
    uuid: crypto.randomUUID(),
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
    >
      <CarouselContent className="-mt-1.5 md:-mt-2 h-50 px-6 md:h-64 md:px-10">
        {logs.map((log, index) => (
          <CarouselItem
            key={log.uuid}
            className="basis-10 pt-2 md:basis-14 md:pt-4"
          >
            <div
              className={cn(
                "flex gap-4 rounded-xl border px-2 py-2 transition-shadow",
                current - 1 !== index && "shadow-none",
              )}
            >
              <Badge variant={log.code === 403 ? "destructive" : "outline"}>
                {log.code}
              </Badge>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
