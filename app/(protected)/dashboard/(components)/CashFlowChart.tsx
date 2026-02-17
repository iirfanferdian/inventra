"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { useMemo } from "react";
import { getLast6Months } from "@/utils/getLast6Months";
import { formatMonth } from "@/utils/formatMonth";

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

export function CashFlowChart() {
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
        <CardTitle>Cashflow Analysis</CardTitle>
        <CardDescription>Inflow vs Outflow comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Tooltip dengan urutan kustom: Inflow selalu diatas */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
              itemSorter={(item) => (item.dataKey === "inflow" ? -1 : 1)}
            />

            {/* Definisi Gradient agar transparan & cantik */}
            <defs>
              <linearGradient id="fillInflow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-inflow)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-inflow)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutflow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-outflow)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-outflow)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* AREA 1: Inflow */}
            <Area
              dataKey="inflow"
              type="natural"
              fill="url(#fillInflow)"
              fillOpacity={0.4}
              stroke="var(--color-inflow)"
              stackId={undefined}
            />

            {/* AREA 2: Outflow */}
            <Area
              dataKey="outflow"
              type="natural"
              fill="url(#fillOutflow)"
              fillOpacity={0.4}
              stroke="var(--color-outflow)"
              stackId={undefined}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Profit margin is healthy <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Based on last 6 months data
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
