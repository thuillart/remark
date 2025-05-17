import "server-only";

import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Suspense } from "react";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { CONTACT_CONFIG } from "@/lib/configs/contact";
import { getSlugFromProductId } from "@/lib/configs/products";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { contact } from "@/lib/db/schema";
import type { SubscriptionSlug } from "@/lib/schema";
import { tryCatch } from "@/lib/utils";
import { UpgradeButton } from "@/usage/components/upgrade-button";
import { UsageSkeleton } from "@/usage/components/usage-skeleton";

interface ApiKey {
  requestCount?: number;
  lastRequest?: string | Date;
}

export default function UsagePage() {
  return (
    <Suspense fallback={<UsageSkeleton />}>
      <UsageCards />
    </Suspense>
  );
}

async function UsageCards() {
  const { data: customerState } = await authClient.customer.state();

  const slug = customerState.activeSubscriptions?.[0]?.productId
    ? getSlugFromProductId(customerState.activeSubscriptions[0].productId)
    : "free";

  const apiKeyConfig = API_KEY_CONFIG[slug];
  const contactConfig = CONTACT_CONFIG[slug];

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session.user.id;

  const [{ data: apiKeys }, contactsCount] = await Promise.all([
    tryCatch(
      auth.api.listApiKeys({
        headers: await headers(),
      }),
    ),
    db
      .select({ count: count() })
      .from(contact)
      .where(eq(contact.referenceId, userId)),
  ]);

  const totalRequestsCount = apiKeys.reduce((accumulator, apiKey) => {
    return accumulator + (apiKey.requestCount ?? 0);
  }, 0);

  const requestsMadeToday = countRequestsToday(apiKeys);

  const transactionalLimits = [
    {
      title: "Monthly limit",
      total: apiKeyConfig.refillAmount ?? 0,
      used: totalRequestsCount,
    },
    {
      title: "Daily limit",
      total: apiKeyConfig.rateLimitMax ?? 0,
      used: requestsMadeToday,
    },
  ];

  const internalLimits = [
    {
      title: "Contacts limit",
      total: contactConfig.limit ?? 0,
      used: contactsCount[0].count,
    },
    {
      title: "Segments limit",
      total: null,
    },
  ];

  return (
    <main className="container">
      <UsageCard
        slug={slug}
        title="External"
        limits={transactionalLimits}
        description={`Integrate feedback into your app using the ${APP_NAME} API.`}
      />
      <UsageCard
        slug={slug}
        title="Internal"
        limits={internalLimits}
        description="Know who's behind the feedback and segment them."
      />
    </main>
  );
}

function UsageCard({
  slug,
  title,
  limits,
  description,
}: {
  slug: SubscriptionSlug;
  title: string;
  limits: { title: string; total: number | string; used?: number }[];
  description: string;
}) {
  const getUsageColor = (used: number, total: number | string) => {
    if (typeof total === "string") return "text-green-700 dark:text-green-400";
    const percentage = (used / total) * 100;
    if (percentage >= 80) return "text-red-700 dark:text-red-400";
    if (percentage >= 50) return "text-yellow-700 dark:text-yellow-400";
    return "text-green-700 dark:text-green-400";
  };

  const getStrokeDashoffset = (used: number, total: number | string) => {
    if (typeof total === "string" || total === 0 || total === null) return 0;
    const circumference = 2 * Math.PI * 8; // 2πr where r=8
    const percentage = (used ?? 0) / total;
    return circumference * (1 - percentage);
  };

  return (
    <div className="border-slate-4 flex flex-col border-b py-4 md:flex-row md:pt-8 md:pb-16">
      <div className="flex w-full justify-between md:block md:w-1/2">
        <h2 className="mb-1 text-xl font-bold tracking-tight">{title}</h2>
        <span className="text-muted-foreground mb-4 hidden text-sm md:block md:w-1/2">
          {description}
        </span>
        <UpgradeButton slug={slug} />
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="text-base font-medium capitalize">{slug}</h3>
        <div className="relative w-full overflow-x-auto overflow-y-hidden">
          <table className="m-0 mb-2 w-max min-w-full border-separate border-spacing-0 border-none p-0 py-4 text-left md:w-full">
            <tbody>
              {limits.map((limit) => (
                <tr key={limit.title}>
                  <td className="h-10 w-[32px] overflow-hidden border-b px-0 text-center text-sm text-ellipsis whitespace-nowrap">
                    <svg
                      width="22"
                      height="22"
                      className="flip -mt-[1px] rotate-180"
                    >
                      <title>Usage</title>
                      <circle
                        r={8}
                        cx={11}
                        cy={11}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={3}
                        className="text-muted"
                      />
                      <circle
                        r={8}
                        cx={11}
                        cy={11}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth={3}
                        className={getUsageColor(limit.used ?? 0, limit.total)}
                        strokeLinecap="round"
                        strokeDasharray="50.26548245743669"
                        strokeDashoffset={getStrokeDashoffset(
                          limit.used ?? 0,
                          limit.total,
                        )}
                      />
                    </svg>
                  </td>
                  <td className="h-10 w-3/5 overflow-hidden border-b px-0 py-3.5 text-sm text-ellipsis whitespace-nowrap">
                    {limit.title}
                  </td>
                  <td className="h-10 overflow-hidden border-b px-0 text-right text-sm text-ellipsis whitespace-nowrap">
                    {limit.total === null ? (
                      "Unlimited"
                    ) : (
                      <>
                        {limit.used} / {limit.total}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function countRequestsToday(apiKeys: ApiKey[]): number {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return apiKeys.reduce((total, key) => {
    if (!key.lastRequest) return total;
    const lastRequestDate = new Date(key.lastRequest);
    if (lastRequestDate < startOfDay) return total;
    return total + (key.requestCount ?? 0);
  }, 0);
}
