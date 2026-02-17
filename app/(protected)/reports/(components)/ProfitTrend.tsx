"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { getLast6Months } from "@/utils/getLast6Months"; // Asumsi utility ini ada

const chartConfig = {
  profit: {
    label: "Net Profit",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProfitTrend() {
  const { data, isLoading } = useQuery(TransactionQueryOptions.all());

  const formattedData = useMemo(() => {
    const lastSixMonths = getLast6Months(); // Mengambil daftar [{month: 0, year: 2024}, ...]

    if (!data?.data) return [];

    return lastSixMonths
      .map((period) => {
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "short",
        }).format(new Date(period.year, period.month));

        const monthlyNet = data.data.reduce((acc, tx) => {
          const txDate = new Date(tx.createdAt);
          if (
            txDate.getMonth() === period.month &&
            txDate.getFullYear() === period.year
          ) {
            const amount = tx.priceAtTransaction * tx.quantity;
            // OUT = Penjualan (Revenue), IN = Kulakan/Biaya (Expense)
            if (tx.type === "OUT") return acc + amount;
            if (tx.type === "IN") return acc - amount;
          }
          return acc;
        }, 0);

        return {
          month: monthName,
          profit: monthlyNet,
        };
      })
      .reverse(); // Agar urutan dari bulan terlama ke terbaru (Kiri ke Kanan)
  }, [data]);

  // Hitung persentase trend sederhana (Bulan ini vs Bulan lalu)
  const trendStats = useMemo(() => {
    if (formattedData.length < 2) return { percent: 0, isUp: true };
    const current = formattedData[formattedData.length - 1].profit;
    const previous = formattedData[formattedData.length - 2].profit;

    if (previous === 0) return { percent: 100, isUp: true };
    const diff = ((current - previous) / Math.abs(previous)) * 100;

    return {
      percent: Math.abs(diff).toFixed(1),
      isUp: diff >= 0,
    };
  }, [formattedData]);

  return (
    <Card className="border border-muted-background bg-background rounded-lg hover:shadow-lg transition-shadow my-10">
      <CardHeader>
        <CardTitle>Profit Trend</CardTitle>
        <CardDescription>
          Monthly net profit for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[300px] w-full" config={chartConfig}>
          <AreaChart
            data={formattedData}
            margin={{ left: 12, right: 12, top: 10 }}
          >
            <defs>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-profit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-profit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              hide // Sembunyikan YAxis jika ingin tampilan minimalis seperti shadcn
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-profit)", strokeWidth: 2 }}
              content={<ChartTooltipContent />}
            />
            <Area
              dataKey="profit"
              type="monotone"
              fill="url(#fillProfit)"
              stroke="var(--color-profit)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending {trendStats.isUp ? "up" : "down"} by {trendStats.percent}
              % this month
              {trendStats.isUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="text-muted-foreground leading-none">
              {formattedData[0]?.month} -{" "}
              {formattedData[formattedData.length - 1]?.month}{" "}
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
