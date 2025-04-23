import { CircleArrow } from "@/components/circle-arrow";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Benefits() {
  return (
    <section className="container">
      <div className="py-24">
        <h2 className="text-4xl/14 font-semibold tracking-tight md:px-6">
          We make it easy.
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
          <div className="relative flex h-75 flex-col-reverse overflow-hidden rounded-2xl border p-4 md:p-8">
            <h5 className="self-start text-lg/6 font-medium -tracking-[.015em] [&_span]:opacity-50">
              Clear and comprehensive docs.{" "}
              <span>Developer documentation the way it should be.</span>
            </h5>
            <div className="from-background absolute inset-0 -z-1 bg-gradient-to-t from-20% to-transparent"></div>
            <div className="-z-2 h-full rounded-xl border border-b-0 shadow-xs md:inset-8"></div>
          </div>

          <div className="relative flex h-75 flex-col gap-4 overflow-hidden rounded-2xl border p-4 md:p-8">
            <h5 className="self-start text-lg/6 font-medium -tracking-[.015em] [&_span]:opacity-50">
              Tiny by design.{" "}
              <span>So lightweight your bundle size will shrink.</span>
            </h5>
            <Button
              size="sm"
              asChild
              variant="outline"
              className="shrink-0 self-start rounded-lg"
            >
              <Link href="https://bundlephobia.com/" target="_blank">
                Check it out
                <CircleArrow
                  variant="outline"
                  direction="up-right"
                  isHovering={false}
                />
              </Link>
            </Button>
            <div className="from-background absolute inset-0 -z-1 bg-gradient-to-t to-transparent to-40%" />
            <div className="-z-2 -mr-8 -mb-8 h-full rounded-tl-xl border-t border-l shadow-xs"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
