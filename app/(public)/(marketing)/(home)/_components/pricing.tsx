import { headers } from "next/headers";
import React, { cache, Suspense } from "react";

// import { Skeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PricingCard } from "@/home/components/pricing-card";
import { getSlugFromProductId } from "@/lib/configs/products";
import { SubscriptionSlug } from "@/lib/schema";
import { getBaseUrl, tryCatch } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Cache the fetch request for auth state
const getCachedSubscriptionState = cache(async () => {
  const { data: response, error } = await tryCatch(
    fetch(`${getBaseUrl()}/api/auth/state`, {
      headers: await headers(),
      cache: "no-store",
    }),
  );

  if (error || !response) {
    console.error("Error fetching auth state:", error);
    return null;
  }

  console.log("Auth State Response:", {
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    statusText: response.statusText,
  });

  if (!response.ok) return null;

  const { data, error: jsonError } = await tryCatch(response.json());

  if (jsonError) {
    console.error("Error parsing auth state:", jsonError);
    return null;
  }

  console.log("Auth State Data:", JSON.stringify(data, null, 2));
  return data;
});

type Plan = {
  id: SubscriptionSlug;
  name: string;
  price: number;
  features: { id: string; content: string | React.ReactNode }[];
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
          <h2 className="text-4xl/14 font-semibold tracking-tight">
            Forget about your bill.
          </h2>
          <p className="text-muted-foreground text-xl font-medium tracking-tight">
            Use the core product for free, forever.
          </p>
        </div>
        <div className="mt-18 grid gap-4 md:grid-cols-3">
          <Suspense
            fallback={
              <>
                <Skeleton className="h-97.5 rounded-2xl border" />
                <Skeleton className="h-97.5 rounded-2xl border" />
                <Skeleton className="h-97.5 rounded-2xl border" />
              </>
            }
          >
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
  const slug = productId ? getSlugFromProductId(productId) : "free";

  return (
    <>
      {plans.map(({ id, ...plan }) => (
        <PricingCard id={id} key={id} currentSlug={slug} {...plan} />
      ))}
    </>
  );
}
