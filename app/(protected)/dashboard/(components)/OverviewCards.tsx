"use client";
import { ItemQueryOptions } from "@/hooks/queries/use-items";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { formattedPrice, useCurrencyStore } from "@/utils/formatPrice";
import { percentageDiff } from "@/utils/percentageDiff";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { text } from "stream/consumers";

const OverviewCards = () => {
  const { data: itemData, isPending: itemIsPending } = useQuery(
    ItemQueryOptions.all(),
  );
  const { data: txData, isPending: txIsPending } = useQuery(
    TransactionQueryOptions.all(),
  );

  const currency = useCurrencyStore((state) => state.currency);

  //Get current Month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  //Get Last Month
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const formattedData = useMemo(() => {
    if (!itemData || !txData)
      return {
        inventoryValue: 0,
        lowStock: 0,
        monthlyTx: 0,
        totalProducts: 0,
        txStats: {
          currentMonthTotal: 0,
          lastMonthTotal: 0,
        },
        itemStats: {
          currentMonthTotal: 0,
          lastMonthTotal: 0,
        },
      };

    //Inventory value
    const inventoryValue = itemData.reduce(
      (acc, item) => {
        acc.totalValue += item.price * item.currentStock;
        return acc;
      },
      { totalValue: 0 },
    );

    const itemStats = itemData.reduce(
      (acc, item) => {
        const itemDate = new Date(item.updatedAt);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();

        if (itemMonth === currentMonth && itemYear === currentYear) {
          acc.currentMonthTotal += item.currentStock;
        } else if (itemMonth === lastMonth && itemYear === lastMonthYear) {
          acc.lastMonthTotal += item.currentStock;
        }

        return acc;
      },
      { currentMonthTotal: 0, lastMonthTotal: 0 },
    );

    //Lowstock
    const lowStock = itemData.filter(
      (item) => item.currentStock < item.minStock,
    );

    //monthly tx
    const monthlyTx = txData.data.filter((tx) => {
      const txDate = new Date(tx.createdAt);
      return (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    });

    //tx Monthly stats
    const txStats = txData.data.reduce(
      (acc, tx) => {
        const txDate = new Date(tx.createdAt);
        const txMonth = txDate.getMonth();
        const txYear = txDate.getFullYear();

        // Jika item masuk kategori Bulan Ini
        if (txMonth === currentMonth && txYear === currentYear) {
          acc.currentMonthTotal += 1; // atau += 1 jika hanya hitung jumlah
        }
        // Jika item masuk kategori Bulan Lalu
        else if (txMonth === lastMonth && txYear === lastMonthYear) {
          acc.lastMonthTotal += 1;
        }

        return acc;
      },
      { currentMonthTotal: 0, lastMonthTotal: 0 },
    );

    //total Products
    const totalProducts = itemData.length;

    return {
      inventoryValue: formattedPrice(inventoryValue.totalValue, currency),
      lowStock: lowStock.length,
      monthlyTx: monthlyTx.length,
      totalProducts,
      txStats,
      itemStats,
    };
  }, [
    itemData,
    txData,
    currency,
    currentYear,
    currentMonth,
    lastMonth,
    lastMonthYear,
  ]);

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 w-full h-auto justify-center">
      {/* 1 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto mt-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Total Inventory Value</p>
        <h1 className="text-2xl font-bold">{`${formattedData.inventoryValue}`}</h1>
        <p className="text-muted-foreground">
          <span
            className={
              formattedData.itemStats.currentMonthTotal <
              formattedData.itemStats.lastMonthTotal
                ? "text-red-500"
                : "text-green-600"
            }
          >{`${percentageDiff(formattedData.itemStats?.currentMonthTotal, formattedData.itemStats?.lastMonthTotal)}%`}</span>{" "}
          vs last month
        </p>
      </div>

      {/* 2 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto mt-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Low Stock Items</p>
        <h1 className="text-2xl font-bold">{`${formattedData.lowStock}`}</h1>
        <p className="text-muted-foreground">Items need restocking</p>
      </div>

      {/* 3 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto mt-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Monthly Transactions</p>
        <h1 className="text-2xl font-bold">{`${formattedData.monthlyTx}`}</h1>
        <p className="text-muted-foreground">
          <span
            className={
              formattedData.txStats.currentMonthTotal <
              formattedData.txStats.lastMonthTotal
                ? "text-red-500"
                : "text-green-600"
            }
          >{`${percentageDiff(formattedData.txStats?.currentMonthTotal, formattedData.txStats?.lastMonthTotal)}%`}</span>{" "}
          vs last month
        </p>
      </div>

      {/* 4 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto mt-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Total Products</p>
        <h1 className="text-2xl font-bold">{`${formattedData.totalProducts}`}</h1>
        <p className="text-muted-foreground">Active items in inventory</p>
      </div>
    </div>
  );
};

export default OverviewCards;
