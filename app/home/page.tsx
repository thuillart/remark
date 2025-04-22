import "server-only";

import { Demo } from "@/home/components/demo";
import { Features } from "@/home/components/features";
import { Footer } from "@/home/components/footer";
import { Header } from "@/home/components/header";
import { Hero } from "@/home/components/hero";
import { Proof } from "@/home/components/proof";
import { Separator } from "@/home/components/separator";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden py-16 md:pt-32">
        <Hero />
        <Separator />
        <Demo />
        <Separator />
        <Features />
        <Separator />
        <Proof />
      </main>
      <Footer />
    </>
  );
}
