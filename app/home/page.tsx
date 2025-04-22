import "server-only";

import { Features } from "@/home/components/features";
import { Footer } from "@/home/components/footer";
import { Header } from "@/home/components/header";
import { Hero } from "@/home/components/hero";
import { Separator } from "@/home/components/separator";
import { Taster } from "@/home/components/taster";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden py-16 md:pt-32">
        <Hero />
        <Separator />
        <Taster />
        <Separator />
        <Features />
        <Separator />
      </main>
      <Footer />
    </>
  );
}
