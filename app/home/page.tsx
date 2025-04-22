import "server-only";

import { Footer } from "@/home/components/footer";
import { Header } from "@/home/components/header";
import { Hero } from "@/home/components/hero";
import { Separator } from "@/home/components/separator";
import { Taster } from "@/home/components/taster";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="px-8 py-16 md:px-0 md:pt-32">
        <Hero />
        <Separator />
        <Taster />
        <Separator />
      </main>
      <Footer />
    </>
  );
}
