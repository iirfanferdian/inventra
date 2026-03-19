"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
import { ItemQueryOptions } from "@/hooks/queries/use-items";

// Predefined color palette - always consistent
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const CHART_COLOR_KEYS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
];

export function StockDistributionChart() {
  const { data: items, isPending } = useQuery(ItemQueryOptions.all());

  // Processed data
  const processedData = React.useMemo(() => {
    if (!items) return { chartData: [], totalStock: 0, colorMap: {} };

    // Grouping stock based on category
    const categoryMap = items.reduce(
      (acc, item) => {
        const name = item.category?.name || "Uncategorized";
        const stock = item.currentStock || 0;
        acc[name] = (acc[name] || 0) + stock;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Sort and change to array
    const sortedArray = Object.entries(categoryMap)
      .map(([name, stock]) => ({ category: name, stock }))
      .sort((a, b) => b.stock - a.stock);

    const totalStockAll = sortedArray.reduce(
      (acc, curr) => acc + curr.stock,
      0,
    );

    const colorMap: Record<string, string> = {};

    //Conditional statement if there's 5 or less categories
    if (sortedArray.length <= 5) {
      const chartData = sortedArray.map((item, index) => {
        const colorKey = CHART_COLOR_KEYS[index];
        colorMap[item.category] = CHART_COLORS[index];
        return {
          ...item,
          fill: CHART_COLORS[index],
        };
      });

      return {
        chartData,
        totalStock: totalStockAll,
        colorMap,
      };
    }

    // Conditional statement if is more than 5 "Others"
    const top4 = sortedArray.slice(0, 4);
    const othersRaw = sortedArray.slice(4);
    const othersTotal = othersRaw.reduce((acc, curr) => acc + curr.stock, 0);

    const chartData = [
      ...top4.map((item, index) => {
        colorMap[item.category] = CHART_COLORS[index];
        return {
          ...item,
          fill: CHART_COLORS[index],
        };
      }),
      {
        category: "Others",
        stock: othersTotal,
        fill: "hsl(var(--muted-foreground))",
      },
    ];

    colorMap["Others"] = "hsl(var(--muted-foreground))";

    return { chartData, totalStock: totalStockAll, colorMap };
  }, [items]);

  const { chartData, totalStock, colorMap } = processedData;

  // Dynamic ChartConfig - simplified
  const dynamicConfig = React.useMemo(() => {
    const config: ChartConfig = {
      stock: { label: "Items" },
    };

    chartData.forEach((item) => {
      config[item.category] = {
        label: item.category,
        color: colorMap[item.category] || "hsl(var(--foreground))",
      };
    });

    return config;
  }, [chartData, colorMap]);

  if (isPending) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Inventory Distribution</CardTitle>
          <CardDescription>By Product Category</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-62.5 flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Inventory Distribution</CardTitle>
          <CardDescription>By Product Category</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-62.5 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Distribution</CardTitle>
        <CardDescription>By Product Category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="stock"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              paddingAngle={2}
              cornerRadius={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStock.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Items
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {chartData[0]?.category} has the most stock{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution for {chartData.length} categories
        </div>
      </CardFooter>
    </Card>
  );
}
