import "server-only";

import { CodeIcon, LockOpenIcon, LucideIcon, TypeIcon } from "lucide-react";

import { Logo } from "@/components/logo";
import { FeaturesButton } from "@/home/components/features-button";
import { cn } from "@/lib/utils";

type Node = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

let nodes: Node[] = [
  {
    Icon: LockOpenIcon,
    title: "Open-source.",
    description:
      "Transparency means a lot to us, so our libraries are open-source, ready for you to dive into.",
  },
  {
    Icon: CodeIcon,
    title: "Ownership.",
    description:
      "You own the UI, the UX, the flow. Not another library's opinionated design.",
  },
  {
    Icon: TypeIcon,
    title: "Type-safe.",
    description:
      "Most fast and break nothing with our end-to-end type-safe libraries.",
  },
];

export function Features() {
  return (
    <section className="container">
      <div className="space-y-12 py-24">
        <h2 className="text-4xl/14 font-semibold tracking-tight md:px-6">
          As it should be.
        </h2>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          <div className="relative flex h-75 flex-col-reverse overflow-hidden rounded-2xl border p-4 md:p-8">
            <h5 className="self-start text-lg/6 font-medium -tracking-[.015em] [&_span]:opacity-50">
              Clear and comprehensive docs.{" "}
              <span>Developer documentation the way it should be.</span>
            </h5>
            <div className="from-background absolute inset-0 -z-1 bg-gradient-to-t from-20% to-transparent"></div>
            <div className="-z-2 flex flex-col items-start gap-5 overflow-hidden rounded-xl border border-b-0 px-8 pt-6 shadow-xs md:inset-8">
              <Logo className="-ml-2.5 scale-80" />
              <div className="grid w-full grid-cols-[1fr_3fr] gap-2">
                <div className="flex h-full flex-col gap-2">
                  {[7, 9, 5, 8, 6].map((width) => (
                    <div
                      key={width}
                      className={`bg-border h-2 w-${width}/12 rounded-full`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 grid-rows-3 gap-3">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="aspect-4/3 rounded-md border" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex h-75 flex-col gap-4 overflow-hidden rounded-2xl border p-4 md:p-8">
            <h5 className="self-start text-lg/6 font-medium -tracking-[.015em] [&_span]:opacity-50">
              Tiny by design.{" "}
              <span>So lightweight your bundle size will shrink.</span>
            </h5>
            <FeaturesButton />
            <div className="from-background absolute inset-0 -z-1 bg-gradient-to-t to-transparent to-40%" />
            <div className="-z-2 -mr-8 -mb-8 h-full rounded-tl-xl border-t border-l shadow-xs"></div>
          </div>
        </div>

        <div>
          {nodes.map(({ Icon, title, description }, index) => (
            <FeatureItem
              key={title}
              Icon={Icon}
              index={index}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  Icon,
  title,
  index,
  description,
}: Node & { index: number }) {
  return (
    <div
      className={cn("grid gap-2 px-8 py-7 md:grid-cols-2 md:gap-10 md:py-8", {
        "rounded-2xl border": index % 2 === 1,
      })}
    >
      <div className="flex items-center gap-4">
        <Icon size={32} strokeWidth={1.5} />
        <h5 className="font-semibold">{title}</h5>
      </div>
      <p className="text-muted-foreground font-medium">{description}</p>
    </div>
  );
}
