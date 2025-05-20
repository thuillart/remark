import { headers } from "next/headers";
import React, { cache, Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ContactUsButton } from "@/home/components/contact-us-button";
import { PricingCard } from "@/home/components/pricing-card";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { CONTACT_CONFIG } from "@/lib/configs/contact";
import { getSlugFromProductId } from "@/lib/configs/products";
import { SubscriptionSlug } from "@/lib/schema";

export const dynamic = "force-dynamic";

// Cache the fetch request for auth state
const getCachedSubscriptionState = cache(async () => {
  const { data: customerState } = await authClient.customer.state();
  return customerState;
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
      {
        id: "free-1",
        content: "No credit card required",
      },
      {
        id: "free-2",
        content: "250 feedbacks per month",
      },
      {
        id: "free-3",
        content: "25 feedbacks per day",
      },
      {
        id: "free-4",
        content: `${CONTACT_CONFIG.free.limit.toLocaleString()} contacts limit`,
      },
    ],
    description: "For getting started.",
  },
  {
    id: "plus",
    name: "Plus",
    price: 20,
    features: [
      {
        id: "plus-1",
        content: `${API_KEY_CONFIG.plus.remaining.toLocaleString()} feedbacks per month`,
      },
      {
        id: "plus-2",
        content: "No daily limit",
      },
      {
        id: "plus-3",
        content: `${CONTACT_CONFIG.plus.limit.toLocaleString()} contacts limit`,
      },
      {
        id: "plus-4",
        content: "Votes & ranking",
      },
    ],
    description: "For more feedbacks.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 200,
    features: [
      {
        id: "pro-1",
        content: `10,000 feedbacks per month`,
      },
      {
        id: "pro-2",
        content: "Overage at $0.008/feedback",
      },
      {
        id: "pro-3",
        content: `Unlimited contacts`,
      },
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
        <div className="mt-12 flex justify-center">
          <div className="relative flex flex-col gap-2 rounded-2xl border px-6 py-4 font-medium md:flex-row">
            Want enterprise features?
            <ContactUsButton />
          </div>
        </div>
      </div>
    </section>
  );
}

async function PricingCards() {
  // 1. We get user's session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // Not signed in, show all plans
    return plans.map(({ id, ...plan }) => (
      <PricingCard id={id} key={id} {...plan} />
    ));
  }

  // 2. User is signed in, we check if they have any ongoing subscription
  const state = await getCachedSubscriptionState();
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
