"use client";

import { Area, AreaChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Feedbacks",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

interface EngagementChartProps {
  data: {
    range: string;
    value: number;
  }[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="-ml-1.5 h-8 w-[calc(100%+0.625rem)] translate-x-px"
    >
      <AreaChart data={data} accessibilityLayer>
        <XAxis hide dataKey="range" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
          position={{ y: 48 }}
        />
        <Area
          fill="var(--color-chart-1)"
          type="linear"
          stroke="var(--color-chart-1)"
          dataKey="value"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  );
}
