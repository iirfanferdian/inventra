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

// Contoh Data Cashflow (Inflow vs Outflow)
const chartData = [
  { month: "January", inflow: 186, outflow: 80 },
  { month: "February", inflow: 305, outflow: 200 },
  { month: "March", inflow: 237, outflow: 120 },
  { month: "April", inflow: 73, outflow: 190 }, // Kasus Loss (Outflow > Inflow)
  { month: "May", inflow: 209, outflow: 130 },
  { month: "June", inflow: 214, outflow: 140 },
];

const chartConfig = {
  inflow: {
    label: "Income",
    color: "hsl(var(--chart-inflow))", // Hijau
  },
  outflow: {
    label: "Expense",
    color: "hsl(var(--chart-outflow))", // Merah
  },
} satisfies ChartConfig;

export function CashFlowChart() {
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
            data={chartData}
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
              fill="url(#fillInflow)" // Pakai Gradient
              fillOpacity={0.4} // Transparansi agar overlap terlihat
              stroke="var(--color-inflow)"
              stackId={undefined} // PENTING: Jangan pakai stackId
            />

            {/* AREA 2: Outflow */}
            <Area
              dataKey="outflow"
              type="natural"
              fill="url(#fillOutflow)" // Pakai Gradient
              fillOpacity={0.4} // Transparansi agar overlap terlihat
              stroke="var(--color-outflow)"
              stackId={undefined} // PENTING: Jangan pakai stackId
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
