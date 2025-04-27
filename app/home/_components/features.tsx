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

type Feature = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
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
      <div className="space-y-12 py-12 md:py-24">
        <h2 className="font-semibold text-4xl/14 tracking-tight md:px-6">
          As it should be.
        </h2>

        {/* Most important features */}
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          <DocsCard />
          <BundleSizeCard />
        </div>

        {/* Other features */}
        <ul className="space-y-4">
          {features.map(({ Icon, title, description }, index) => {
            const showBorder = index % 2 === 1;
            return (
              <li key={title}>
                <article
                  className={cn(
                    "grid gap-2 px-8 py-7 md:grid-cols-2 md:gap-10 md:py-8",
                    showBorder && "rounded-2xl border",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={32} strokeWidth={1.5} />
                    <h3 className="font-semibold">{title}</h3>
                  </div>
                  <p className="font-medium text-muted-foreground">
                    {description}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function DocsCard() {
  return (
    <div className="relative flex h-75 flex-col-reverse overflow-hidden rounded-2xl border p-4 md:p-8">
      <h3 className="-tracking-[.015em] self-start font-medium text-lg/6 [&_span]:opacity-50">
        Clear and comprehensive docs.{" "}
        <span>Developer documentation the way it should be.</span>
      </h3>
      <div className="-z-1 absolute inset-0 bg-gradient-to-t from-20% from-background to-transparent" />
      <div className="-z-2 flex select-none flex-col items-start gap-5 overflow-hidden rounded-xl border border-b-0 px-6 pt-4 shadow-xs md:inset-8 md:px-8 md:pt-6">
        <Logo className="-ml-2.5 scale-80" />
        <div className="grid w-full grid-cols-[1fr_3fr] gap-2">
          <div className="flex h-full flex-col gap-2">
            {[70, 90, 50, 80, 60].map((width) => (
              <div
                key={width}
                style={{ width: `${width}%` }}
                className="h-2 rounded-full bg-border"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 grid-rows-3 gap-3">
            {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((id) => (
              <div key={id} className="aspect-4/3 rounded-md border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const example = ts`
  // [!code highlight:1]
  import { ... } from '...' // 2.5k (gzipped: 950)

  const nucleon = new Nucleon(...)

  async function send() {
    "use server";
    // ...
  }
`;

function BundleSizeCard() {
  return (
    <div className="relative flex h-75 flex-col gap-4 overflow-hidden rounded-2xl border p-4 md:p-8">
      <h3 className="-tracking-[.015em] self-start font-medium text-lg/6 [&_span]:text-muted-foreground">
        Tiny by design.{" "}
        <span>So lightweight your bundle size will shrink.</span>
      </h3>
      <FeaturesButton />
      <div className="dark -mr-8 -mb-8 relative h-full overflow-hidden rounded-tl-xl bg-background shadow-xs">
        <CodeExample example={example} className="*:md:w-min" />
      </div>
    </div>
  );
}
