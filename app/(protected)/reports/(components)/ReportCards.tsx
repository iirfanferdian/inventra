"use client";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { formattedPrice } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, TrendingDown } from "lucide-react";
import { useMemo } from "react";

const ReportCards = () => {
  const { data, isLoading } = useQuery(TransactionQueryOptions.all());

  const validateData = useMemo(() => {
    if (!data?.data)
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        net: 0,
        inventoryValue: 0,
      };

    let totalRevenue: number = 0;
    let totalExpenses: number = 0;

    data?.data?.forEach((item) => {
      if (item.type === "IN") {
        totalExpenses += item.priceAtTransaction * item.quantity;
      }
      if (item.type === "OUT") {
        totalRevenue += item.priceAtTransaction * item.quantity;
      }
    });

    const net = totalRevenue + -totalExpenses;

    // * Next feature
    // const inventoryValue = totalExpenses;

    return {
      totalRevenue: formattedPrice(totalRevenue),
      totalExpenses: formattedPrice(totalExpenses),
      net: formattedPrice(net),
      // inventoryValue: formattedPrice(inventoryValue),
    };
  }, [data]);

  return (
    <section className="w-full grid grid-cols-3 gap-4">
      {/* 1 */}
      <div className="flex items-center justify-between border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Revenue</p>
          <h1 className="text-xl font-bold">{`${validateData?.totalRevenue}`}</h1>
          <p className="text-sm text-muted-foreground">
            +12.5% from last period
          </p>
        </div>
        <DollarSign
          size={30}
          className="bg-green-600/10 p-2 text-green-600 rounded-lg"
        />
      </div>

      {/* 2 */}
      <div className="flex justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Expenses</p>
          <h1 className="text-xl font-bold">{`${validateData?.totalExpenses}`}</h1>
          <p className="text-sm text-muted-foreground">
            +5.2% from last period
          </p>
        </div>
        <TrendingDown
          size={30}
          className="bg-red-600/10 p-2 text-red-600/80 rounded-lg"
        />
      </div>

      {/* 3 */}
      <div className="flex justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Net Profit</p>
          <h1 className="text-xl font-bold">{`${validateData.net}`}</h1>
          <p className="text-sm text-muted-foreground">
            +18.3% from last period
          </p>
        </div>
        <TrendingDown
          size={30}
          className="bg-red-600/10 p-2 text-red-600/80 rounded-lg"
        />
      </div>

      {/* 4 */}
      {/* <div className="flex  justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Inventory Value</p>
          <h1 className="text-xl font-bold">{`Rp ${validateData.inventoryValue}`}</h1>
          <p className="text-sm text-muted-foreground">
            +5.2% from last period
          </p>
        </div>
        <Package
          size={30}
          className="bg-primary/10 p-2 text-primary/80 rounded-lg"
        />
      </div> */}
    </section>
  );
};

export default ReportCards;
