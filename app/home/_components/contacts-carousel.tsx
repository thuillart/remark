"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Feedback = {
  name: string;
  plan: "free" | "pro" | "enterprise";
  body: string;
  email: string;
  gradient: string;
};

const feedbacks: Feedback[] = [
  {
    name: "Yuki",
    plan: "pro",
    body: "Love the app, but I wish there was an option to sort my items by date added. Would make organizing so much easier!",
    email: "yuki.tanaka@example.org",
    gradient: "bg-gradient-to-r from-teal-200 to-teal-500",
  },
  {
    name: "Mohammed",
    plan: "free",
    body: "Everything works great, but can you add a 'dark mode'? My eyes get tired using the bright interface after a while.",
    email: "m.abdullah@fastmail.com",
    gradient: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    name: "Isabella",
    plan: "enterprise",
    body: "I'm missing a way to export my data as CSV or PDF. That feature would be really helpful for sharing reports.",
    email: "isa.rodriguez@gmail.com",
    gradient: "bg-gradient-to-r from-blue-600 to-violet-600",
  },
  {
    name: "Chen Wei",
    plan: "free",
    email: "chenwei.liu@outlook.cn",
    body: "The new update is smooth, but sometimes notifications don't show up. Any chance of a fix in the next patch?",
    gradient: "bg-gradient-to-r from-orange-400 to-rose-400",
  },
  {
    name: "Aisha",
    plan: "free",
    email: "aisha.patel@mail.com",
    body: "Could you add custom tags for items? I'd love more flexibility in how I categorize things.",
    gradient: "bg-gradient-to-r from-emerald-500 to-lime-600",
  },
  {
    name: "Kwame",
    plan: "pro",
    email: "kwame.mensah@inbox.gh",
    body: "App is fast, but syncing between devices is slow. Would appreciate an offline mode or faster sync.",
    gradient: "bg-gradient-to-r from-blue-400 to-emerald-400",
  },
  {
    name: "Sofia",
    plan: "free",
    email: "sofia.kowalski@yahoo.com",
    body: "The tutorial was helpful, but a contextual help button on each page would save time for new users.",
    gradient: "bg-gradient-to-r from-amber-200 to-yellow-500",
  },
];

export function ContactsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnMouseEnter: true,
      stopOnInteraction: true,
    }),
  );

  React.useEffect(() => {
    if (!api) return;

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
      className="relative select-none before:absolute before:inset-0 before:top-auto before:z-1 before:h-4 before:bg-gradient-to-t before:from-background before:to-transparent after:absolute after:inset-0 after:bottom-auto after:z-1 after:h-4 after:bg-gradient-to-b after:from-background after:to-transparent after:md:h-10 before:md:h-10"
      orientation="vertical"
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="h-50 px-6 md:h-64 md:px-10">
        {feedbacks.map((contact, index) => (
          <CarouselItem key={contact.name} className="basis-1/2">
            <FeedbackCard
              plan={contact.plan}
              contact={contact}
              isActive={current - 1 === index}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function FeedbackCard({
  plan,
  contact,
  isActive,
}: {
  plan: Feedback["plan"];
  contact: (typeof feedbacks)[0];
  isActive: boolean;
}) {
  const variant: BadgeProps["variant"] =
    plan === "enterprise" ? "indigo" : plan === "pro" ? "blue" : "secondary";

  return (
    <Card
      className={cn("gap-2 p-0 transition-shadow", !isActive && "shadow-none")}
    >
      <div className="flex items-center gap-2 p-4 pb-0">
        <Avatar className="mt-0.5">
          <AvatarFallback
            className={cn("not-dark:text-background", contact.gradient)}
          >
            {contact.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="inline-flex items-center gap-1 text-sm">
            {contact.name}
            <Badge
              size="sm"
              variant={variant}
              className="text-[10px] uppercase"
            >
              {plan}
            </Badge>
          </div>
          <div className="text-muted-foreground text-xs">{contact.email}</div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <blockquote className="mt-2 border-l-2 pl-3 text-sm italic">
          "{contact.body}"
        </blockquote>
      </div>
    </Card>
  );
}
