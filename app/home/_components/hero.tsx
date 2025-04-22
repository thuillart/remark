import "server-only";

import { HeroArtwork } from "@/home/components/hero-artwork";
import { HeroBackgroundArtwork } from "@/home/components/hero-background-artwork";
import { HeroButtons } from "@/home/components/hero-buttons";

export function Hero() {
  return (
    <section className="container">
      <div className="relative flex flex-col items-center gap-6 pt-14 pb-25">
        <div className="flex flex-col items-center gap-9">
          <HeroBackgroundArtwork />
          <HeroArtwork />
          <div className="flex flex-col items-center gap-4 text-center text-balance">
            <h1 className="text-4xl/12 font-semibold tracking-tighter md:text-5xl/14">
              Get your app out faster
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Collect feedback, iterate and ship products people love.
            </p>
          </div>
        </div>
        <HeroButtons />
      </div>
    </section>
  );
}
