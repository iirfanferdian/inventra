"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getLast6Months } from "@/utils/getLast6Months";
import { formatMonth } from "@/utils/formatMonth";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { useMemo } from "react";

export const description = "A multiple bar chart with Y-Axis label";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  inflow: {
    label: "Income",
    color: "hsl(var(--chart-inflow))",
  },
  outflow: {
    label: "Expense",
    color: "hsl(var(--chart-outflow))",
  },
} satisfies ChartConfig;

export function ReportBarChart() {
  const { data, isPending } = useQuery(TransactionQueryOptions.all());

  const formattedData = useMemo(() => {
    const lastSixMonths = getLast6Months();

    if (!data?.data) {
      return lastSixMonths
        .map((period) => {
          const res = formatMonth([period.month])[0];
          return {
            month: res.month,
            inflow: 0,
            outflow: 0,
          };
        })
        .reverse();
    }

    const result = lastSixMonths.map((period) => {
      const monthString = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(new Date(period.year, period.month));

      const totals = data.data.reduce(
        (acc, tx) => {
          const txDate = new Date(tx.createdAt);
          if (
            txDate.getMonth() === period.month &&
            txDate.getFullYear() === period.year
          ) {
            const amount = tx.priceAtTransaction * tx.quantity;
            if (tx.type === "IN") acc.outflow += amount;
            if (tx.type === "OUT") acc.inflow += amount;
          }
          return acc;
        },
        { inflow: 0, outflow: 0 },
      );

      return {
        month: monthString,
        inflow: totals.inflow,
        outflow: totals.outflow,
      };
    });

    return result.reverse();
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* Menambahkan margin left agar Label YAxis tidak terpotong */}
          <BarChart
            accessibilityLayer
            data={formattedData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            {/* Sumbu Y */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Sumbu Y */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />

            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.3 }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="inflow"
              fill="var(--color-inflow)"
              radius={[0, 0, 4, 4]}
              activeBar={{ fillOpacity: 0.8 }}
            />
            <Bar
              dataKey="outflow"
              fill="var(--color-outflow)"
              radius={[4, 4, 0, 0]}
              activeBar={{ fillOpacity: 0.8 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
