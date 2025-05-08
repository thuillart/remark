import "server-only";

import type { CustomerState } from "@polar-sh/sdk/dist/commonjs/models/components/customerstate";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { API_KEY_CONFIG } from "@/lib/configs/api-key";
import { getSlugFromProductId } from "@/lib/configs/products";
import { APP_NAME } from "@/lib/constants";
import type { SubscriptionTier } from "@/lib/types";
import { getBaseUrl } from "@/lib/utils";
import { Suspense } from "react";

export default function UsagePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsageCards />
    </Suspense>
  );
}

async function UsageCards() {
  const response = await fetch(`${getBaseUrl()}/api/auth/state`, {
    headers: await headers(),
  });

  const state = (await response.json()) as CustomerState;

  const subscription = state.activeSubscriptions[0];
  const tier = getSlugFromProductId(subscription.productId);
  const config = API_KEY_CONFIG[tier];
  const twentyFourHoursInSeconds = 60 * 60 * 24 * 30;

  const transactionalLimits = [
    {
      title: "Monthly limit",
      total: config.rateLimitMax ?? 0,
      used: 400,
    },
    {
      title: "Daily limit",
      total: config.rateLimitTimeWindow === twentyFourHoursInSeconds ? null : 0,
    },
  ];

  const internalLimits = [
    {
      title: "Contacts limit",
      total: 1000,
      used: 0,
    },
    {
      title: "Segments limit",
      total: null,
    },
  ];

  return (
    <main className="container">
      <UsageCard
        tier={getSlugFromProductId(subscription.productId)}
        title="External"
        limits={transactionalLimits}
        description={`Integrate feedback into your app using the ${APP_NAME} API.`}
      />
      <UsageCard
        tier={getSlugFromProductId(subscription.productId)}
        title="Internal"
        limits={internalLimits}
        description={`Integrate email into your app using the ${APP_NAME} API.`}
      />
    </main>
  );
}

function UsageCard({
  tier,
  title,
  limits,
  description,
}: {
  tier: SubscriptionTier;
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
    if (typeof total === "string") return 0;
    const circumference = 2 * Math.PI * 8; // 2πr where r=8
    const percentage = used / total;
    return circumference * (1 - percentage);
  };

  return (
    <div className="flex flex-col border-slate-4 border-b py-4 md:flex-row md:pt-8 md:pb-16">
      <div className="flex w-full justify-between md:block md:w-1/2">
        <h2 className="mb-1 font-bold text-xl tracking-tight">{title}</h2>
        <span className="mb-4 hidden text-muted-foreground text-sm md:block md:w-1/2">
          {description}
        </span>
        <Button size="sm">Upgrade</Button>
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="font-medium text-base capitalize">{tier}</h3>
        <div className="relative w-full overflow-x-auto overflow-y-hidden">
          <table className="m-0 mb-2 w-max min-w-full border-separate border-spacing-0 border-none p-0 py-4 text-left md:w-full">
            <tbody>
              {limits.map((limit) => (
                <tr key={limit.title}>
                  <td className="h-10 w-[32px] overflow-hidden text-ellipsis whitespace-nowrap border-b px-0 text-center text-sm">
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
                  <td className="h-10 w-3/5 overflow-hidden text-ellipsis whitespace-nowrap border-b px-0 py-3.5 text-sm">
                    {limit.title}
                  </td>
                  <td className="h-10 overflow-hidden text-ellipsis whitespace-nowrap border-b px-0 text-right text-sm">
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
