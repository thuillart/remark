import "server-only";

import type { CustomerState } from "@polar-sh/sdk/dist/commonjs/models/components/customerstate";
import { headers } from "next/headers";
import { cache } from "react";
import { type ReactNode, Suspense } from "react";

import { PricingCard } from "@/home/components/pricing-card";
import { PricingSkeleton } from "@/home/components/pricing-skeleton";
import { getSlugFromProductId } from "@/lib/configs/products";
import { getBaseUrl } from "@/lib/utils";

// Cache the fetch request for auth state
const getCachedSubscriptionState = cache(async () => {
  const response = await fetch(`${getBaseUrl()}/api/auth/state`, {
    headers: await headers(),
  });

  if (!response.ok) return null;
  return response.json() as Promise<CustomerState>;
});

type Plan = {
  id: "free" | "plus" | "pro";
  name: string;
  price: number;
  features: { id: string; content: string | ReactNode }[];
  description: string;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      { id: "free-1", content: "No credit card required" },
      { id: "free-2", content: "Up to 250 feedbacks a month" },
      { id: "free-3", content: "Daily & monthly feedbacks limits" },
      { id: "free-4", content: "Core features, including:" },
    ],
    description: "For getting started.",
  },
  {
    id: "plus",
    name: "Plus",
    price: 20,
    features: [
      { id: "plus-1", content: "10-20x more feedbacks a month" },
      { id: "plus-2", content: "No daily feedbacks limits" },
      { id: "plus-3", content: "Votes & ranking" },
      { id: "plus-4", content: "AI-powered features, including:" },
    ],
    description: "For more feedbacks.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 200,
    features: [
      { id: "pro-1", content: "30-50x more feedbacks a month" },
      { id: "pro-2", content: "No daily feedbacks limits" },
    ],
    description: "For power users.",
  },
];

export async function Pricing() {
  return (
    <section className="container">
      <div className="py-12 md:pt-24 md:pb-12">
        <div className="space-y-3 md:px-6">
          <h2 className="font-semibold text-4xl/14 tracking-tight">
            Forget about your bill.
          </h2>
          <p className="font-medium text-muted-foreground text-xl tracking-tight">
            Use the core product for free, forever.
          </p>
        </div>
        <div className="mt-18 grid gap-4 md:grid-cols-3">
          <Suspense fallback={<PricingSkeleton />}>
            <PricingCards />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function PricingCards() {
  const state = await getCachedSubscriptionState();

  if (!state) {
    // Not signed in, show all plans
    return (
      <>
        {plans.map(({ id, ...plan }) => (
          <PricingCard id={id} key={id} {...plan} />
        ))}
      </>
    );
  }

  const productId = state?.activeSubscriptions[0]?.productId;
  const currentPlan = productId ? getSlugFromProductId(productId) : "free";

  return (
    <>
      {plans.map(({ id, ...plan }) => (
        <PricingCard id={id} key={id} currentPlan={currentPlan} {...plan} />
      ))}
    </>
  );
}
