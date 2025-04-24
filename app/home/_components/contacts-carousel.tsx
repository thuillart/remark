"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

let feedbacks = [
  {
    name: "Aaliyah",
    email: "aaliyah.ng@example.org",
    body: "Love the app, but I wish there was an option to sort my items by date added. Would make organizing so much easier!",
  },
  {
    name: "Carlos",
    email: "carlito89@fastmail.com",
    body: "Everything works great, but can you add a 'dark mode'? My eyes get tired using the bright interface after a while.",
  },
  {
    name: "Fatima",
    email: "fatima_hassan@gmail.com",
    body: "I'm missing a way to export my data as CSV or PDF. That feature would be really helpful for sharing reports.",
  },
  {
    name: "Liam",
    email: "liam_o.conner@outlook.co.uk",
    body: "The new update is smooth, but sometimes notifications don't show up. Any chance of a fix in the next patch?",
  },
  {
    name: "Sophia",
    email: "sophialovescode@mail.com",
    body: "Could you add custom tags for items? I'd love more flexibility in how I categorize things.",
  },
  {
    name: "Raj",
    email: "raj.patel123@inbox.lv",
    body: "App is fast, but syncing between devices is slow. Would appreciate an offline mode or faster sync.",
  },
  {
    name: "Emily",
    email: "e_m_thompson@yahoo.com",
    body: "The tutorial was helpful, but a contextual help button on each page would save time for new users.",
  },
];

export function ContactsCarousel() {
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
      className="h-full [&>*]:h-full"
      orientation="vertical"
    >
      <CarouselContent className="-mt-1 h-64 px-6 md:px-10">
        {feedbacks.map((contact, index) => (
          <CarouselItem key={contact.name} className="md:basis-1/2">
            <Card
              className={cn(
                "h-[calc(16rem-3rem-1rem)] transition-shadow md:h-[calc(16rem-5rem-1rem)]",
                current - 1 !== index && "shadow-none",
              )}
            >
              <CardHeader className="flex items-center gap-4"></CardHeader>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
