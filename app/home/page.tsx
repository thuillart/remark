import "server-only";

import { Demo } from "@/home/components/demo";
import { FAQs } from "@/home/components/faqs";
import { Features } from "@/home/components/features";
import { Footer } from "@/home/components/footer";
import { Header } from "@/home/components/header";
import { Hero } from "@/home/components/hero";
import { Benefits } from "@/home/components/proof";
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
        <Benefits />
        <Separator />
        <FAQs />
      </main>
      <Footer />
    </>
  );
}
