import "server-only";

import {
  CodeIcon,
  LockOpenIcon,
  type LucideIcon,
  TypeIcon,
} from "lucide-react";

import { CodeExample, ts } from "@/components/code-example";
import { Logo } from "@/components/logo";
import { FeaturesButton } from "@/home/components/features-button";
import { cn } from "@/lib/utils";

type Node = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

const nodes: Node[] = [
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

const example = ts`
  // [!code highlight:1]
  import { ... } from '...' // 2.5k (gzipped: 950)

  const nucleon = new Nucleon(...)

  async function send() {
    "use server";
    // ...
  }
`;

export function Features() {
  return (
    <section className="container">
      <div className="space-y-12 py-12 md:py-24">
        <h2 className="text-4xl/14 font-semibold tracking-tight md:px-6">
          As it should be.
        </h2>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          <div className="relative flex h-75 flex-col-reverse overflow-hidden rounded-2xl border p-4 md:p-8">
            <h5 className="self-start text-lg/6 font-medium -tracking-[.015em] [&_span]:opacity-50">
              Clear and comprehensive docs.{" "}
              <span>Developer documentation the way it should be.</span>
            </h5>
            <div className="from-background absolute inset-0 -z-1 bg-gradient-to-t from-20% to-transparent" />
            <div className="-z-2 flex flex-col items-start gap-5 overflow-hidden rounded-xl border border-b-0 px-6 pt-4 shadow-xs md:inset-8 md:px-8 md:pt-6">
              <Logo className="-ml-2.5 scale-80" />
              <div className="grid w-full grid-cols-[1fr_3fr] gap-2">
                <div className="flex h-full flex-col gap-2">
                  {[70, 90, 50, 80, 60].map((width) => (
                    <div
                      key={width}
                      style={{ width: `${width}%` }}
                      className="bg-border h-2 rounded-full"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 grid-rows-3 gap-3">
                  {Array.from({ length: 9 }).map(() => (
                    <div
                      key={crypto.randomUUID()}
                      className="aspect-4/3 rounded-md border"
                    />
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
            <div className="dark bg-background relative -mr-8 -mb-8 h-full overflow-hidden rounded-tl-xl shadow-xs">
              <CodeExample example={example} className="*:md:w-min" />
            </div>
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
