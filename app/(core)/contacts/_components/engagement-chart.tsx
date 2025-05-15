"use client";

import { Area, AreaChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  {
    range: "Week 1",
    value: 50,
  },
  {
    range: "Week 2",
    value: 60,
  },
  {
    range: "Week 3",
    value: 70,
  },
  {
    range: "Week 4",
    value: 80,
  },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function EngagementChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="-ml-1.5 h-8 w-[calc(100%+0.625rem)] translate-x-px"
    >
      <AreaChart data={chartData} accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-chart-1)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-chart-1)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          fill="url(#fill)"
          type="natural"
          stroke="var(--color-chart-1)"
          stackId="a"
          dataKey="value"
          fillOpacity={0.4}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
