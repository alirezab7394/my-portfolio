"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  hours: {
    label: "Hours",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function HoursChart({ data }: { data: { date: string; hours: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-36 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(5)}
        />
        <YAxis hide domain={[0, 6]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="hours"
          type="monotone"
          fill="var(--color-hours)"
          fillOpacity={0.2}
          stroke="var(--color-hours)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}