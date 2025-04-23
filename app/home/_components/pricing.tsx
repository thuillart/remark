import "server-only";

import { ReactNode, Suspense } from "react";

import { PricingCard } from "@/home/components/pricing-card";
import { PricingSkeleton } from "@/home/components/pricing-skeleton";

type Node = {
  id: "free" | "plus" | "pro";
  name: string;
  price: number;
  features: (string | ReactNode)[];
  description: string;
};

let nodes: Node[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "No credit card required",
      "Up to 250 feedbacks a month",
      "Daily & monthly feedbacks limits",
      "Core features, including:",
    ],
    description: "For getting started.",
  },
  {
    id: "plus",
    name: "Plus",
    price: 20,
    features: [
      "10-20x more feedbacks a month",
      "No daily feedbacks limits",
      "Votes & ranking",
      "AI-powered features, including:",
    ],
    description: "For more feedbacks.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 200,
    features: ["30-50x more feedbacks a month", "No daily feedbacks limits"],
    description: "For power users.",
  },
];

export async function Pricing() {
  return (
    <section className="container">
      <div className="py-12 md:py-24">
        <div className="space-y-3 md:px-6">
          <h2 className="text-4xl/14 font-semibold tracking-tight">
            Forget about your bill.
          </h2>
          <p className="text-muted-foreground mb-12 text-xl font-medium tracking-tight">
            Use the core product for free, forever.
          </p>
        </div>
        <div className="mt-18 grid gap-4 md:grid-cols-3">
          <Suspense fallback={<PricingSkeleton />}>
            {nodes.map(({ id, ...node }) => (
              <PricingCard id={id} key={id} {...node} />
            ))}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
