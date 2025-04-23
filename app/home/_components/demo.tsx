import "server-only";

import { DemoTabs } from "@/home/components/demo-tabs";

export function Demo() {
  return (
    <section className="container">
      <div className="py-12 md:pt-38 md:pb-24">
        <h2 className="mb-3 text-center text-4xl/14 font-semibold tracking-tight">
          True superpowers.
        </h2>
        <p className="text-muted-foreground mb-12 text-center text-xl font-medium tracking-tight">
          Know what your users want most right now.
        </p>
        <DemoTabs />
      </div>
    </section>
  );
}
