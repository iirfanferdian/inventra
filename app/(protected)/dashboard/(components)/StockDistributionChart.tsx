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

export function StockDistributionChart() {
  const { data: items, isPending } = useQuery(ItemQueryOptions.all());

  // Processed data
  const processedData = React.useMemo(() => {
    if (!items) return { chartData: [], totalStock: 0 };

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

    //Conditional statement if there's 5 or less categories
    if (sortedArray.length <= 5) {
      return {
        chartData: sortedArray.map((item) => ({
          ...item,
          fill: `var(--color-${item.category.replace(/\s+/g, "-")})`,
        })),
        totalStock: totalStockAll,
      };
    }

    // Conditional statement if is more than 5 "Others"
    const top4 = sortedArray.slice(0, 4);
    const othersRaw = sortedArray.slice(4);
    const othersTotal = othersRaw.reduce((acc, curr) => acc + curr.stock, 0);

    const finalData = [
      ...top4.map((item) => ({
        ...item,
        fill: `var(--color-${item.category.replace(/\s+/g, "-")})`,
      })),
      {
        category: "Others",
        stock: othersTotal,
        fill: "var(--color-others)",
      },
    ];

    return { chartData: finalData, totalStock: totalStockAll };
  }, [items]);

  const { chartData, totalStock } = processedData;

  // Dynamic ChartConfig
  const dynamicConfig = React.useMemo(() => {
    const config: ChartConfig = {
      stock: { label: "Items" },
    };

    chartData.forEach((item, index) => {
      const key = item.category.replace(/\s+/g, "-");

      if (item.category === "Others") {
        config["others"] = {
          label: "Others",
          color: "hsl(var(--muted-foreground))",
        };
      } else {
        config[key] = {
          label: item.category,
          color: `hsl(var(--chart-${(index % 4) + 1}))`,
        };
      }
    });

    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Distribution</CardTitle>
        <CardDescription>By Product Category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
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
