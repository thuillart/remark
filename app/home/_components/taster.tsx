import "server-only";

import { TasterTabs } from "@/home/components/taster-tabs";

export function Taster() {
  return (
    <section className="container">
      <div className="py-12 md:pt-38 md:pb-24">
        <h2 className="mb-3 text-center text-4xl/14 font-semibold tracking-tight">
          True superpowers.
        </h2>
        <p className="text-muted-foreground mb-12 text-center text-xl font-medium tracking-tight">
          Know what your users want most right now.
        </p>
        <TasterTabs />
      </div>
    </section>
  );
}
