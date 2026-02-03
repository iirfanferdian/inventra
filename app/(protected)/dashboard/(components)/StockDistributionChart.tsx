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

export const description = "A donut chart with text in the center";

// 1. Data Dummy Stock (Ganti ini nanti dengan data dari database kamu)
const chartData = [
  { category: "electronics", stock: 275, fill: "var(--color-electronics)" },
  { category: "clothing", stock: 200, fill: "var(--color-clothing)" },
  { category: "furniture", stock: 187, fill: "var(--color-furniture)" },
  { category: "groceries", stock: 173, fill: "var(--color-groceries)" },
  { category: "others", stock: 90, fill: "var(--color-others)" },
];

// 2. Konfigurasi Label & Warna
const chartConfig = {
  stock: {
    label: "Items",
  },
  electronics: {
    label: "Electronics",
    color: "hsl(var(--chart-1))",
  },
  clothing: {
    label: "Clothing",
    color: "hsl(var(--chart-2))",
  },
  furniture: {
    label: "Furniture",
    color: "hsl(var(--chart-3))",
  },
  groceries: {
    label: "Groceries",
    color: "hsl(var(--chart-4))",
  },
  others: {
    label: "Others",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function StockDistributionChart() {
  // 3. Menghitung Total Stock secara otomatis untuk ditampilkan di tengah
  const totalStock = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.stock, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Distribution</CardTitle>
        <CardDescription>By Product Category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
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
              innerRadius={60} // Membuat lubang tengah (Donut)
              strokeWidth={5}
              paddingAngle={2} // Memberi jarak putih antar irisan
              cornerRadius={5} // Membuat sudut irisan membulat (Modern look)
            >
              {/* 4. Label di Tengah Donut */}
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

            {/* Legend dipindah ke bawah agar rapi */}
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Electronics dominate the stock (30%){" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total distribution for current warehouse
        </div>
      </CardFooter>
    </Card>
  );
}
