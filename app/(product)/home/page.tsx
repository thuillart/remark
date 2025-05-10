import { Demo } from "@/home/components/demo";
import { FAQs } from "@/home/components/faqs";
import { Features } from "@/home/components/features";
import { Hero } from "@/home/components/hero";
import { Pricing } from "@/home/components/pricing";
import { Separator } from "@/home/components/separator";
import { Tools } from "@/home/components/tools";

export default function HomePage() {
  return (
    <main className="pt-16 md:pt-32">
      <Hero />
      <Separator />
      <Demo />
      <Separator />
      <Tools />
      <Separator />
      <Features />
      <Separator />
      <Pricing />
      <FAQs />
      <Separator />
    </main>
  );
}
