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
  uuid: string;
  status: 200 | 403 | 500;
  method: "POST" | "PATCH" | "DELETE";
};

const logs: Log[] = [
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
      className="relative before:absolute before:inset-0 before:top-auto before:z-1 before:h-10 before:bg-gradient-to-t before:from-background before:to-transparent after:absolute after:inset-0 after:bottom-auto after:z-1 after:h-10 after:bg-gradient-to-b after:from-background after:to-transparent"
    >
      <CarouselContent className="-mt-1.5 md:-mt-2 h-50 px-6 md:h-64 md:px-10">
        {logs.map((log, index) => (
          <CarouselItem
            key={log.uuid}
            className="basis-10 pt-2 md:basis-14 md:pt-4"
          >
            <div
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
                      ? "success"
                      : "warning"
                }
              >
                {log.status}
              </Badge>

              <div className="overflow-hidden">
                <p className="w-full truncate font-mono text-muted-foreground text-sm">
                  {`{ id: ${log.uuid} }`}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
