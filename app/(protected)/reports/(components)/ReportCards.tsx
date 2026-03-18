"use client";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { useExportStore } from "@/hooks/use-export-store";
import { formattedPrice, useCurrencyStore } from "@/utils/formatPrice";
import { percentageDiff } from "@/utils/percentageDiff";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, TrendingDown } from "lucide-react";
import { useEffect, useMemo } from "react";

const ReportCards = () => {
  const { data, isLoading } = useQuery(TransactionQueryOptions.all());

  const currency = useCurrencyStore((state) => state.currency);

  //Get current Month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  //Get Last Month
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const validateData = useMemo(() => {
    const DEFAULT_VALUE = {
      currentMonthTotalRevenue: 0,
      lastMonthTotalRevenue: 0,
      currentMonthTotalExpenses: 0,
      lastMonthTotalExpenses: 0,
    };
    if (!data?.data)
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        net: {
          currentMonth: 0,
          lastMonth: 0,
        },
        inventoryValue: 0,
        totalStats: DEFAULT_VALUE,
      };

    const totalStats = data.data.reduce(
      (acc, item) => {
        const itemDate = new Date(item.createdAt);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();

        if (itemMonth === currentMonth && itemYear === currentYear) {
          if (item.type === "IN") {
            acc.currentMonthTotalExpenses +=
              item.priceAtTransaction * item.quantity;
          } else if (item.type === "OUT") {
            acc.currentMonthTotalRevenue +=
              item.priceAtTransaction * item.quantity;
          }
        } else if (itemMonth === lastMonth && itemYear === lastMonthYear) {
          if (item.type === "IN") {
            acc.lastMonthTotalExpenses +=
              item.priceAtTransaction * item.quantity;
          } else if (item.type === "OUT") {
            acc.lastMonthTotalRevenue +=
              item.priceAtTransaction * item.quantity;
          }
        }
        return acc;
      },
      {
        ...DEFAULT_VALUE,
      },
    );

    const net = {
      currentMonth:
        totalStats.currentMonthTotalRevenue +
        -totalStats.currentMonthTotalExpenses,
      lastMonth: -(
        totalStats.lastMonthTotalRevenue + -totalStats.lastMonthTotalExpenses
      ),
    };

    // * Next feature
    // const inventoryValue = totalExpenses;

    return {
      totalRevenue: formattedPrice(
        totalStats.currentMonthTotalRevenue,
        currency,
      ),
      totalExpenses: formattedPrice(
        totalStats.currentMonthTotalExpenses,
        currency,
      ),
      net,
      totalStats,
      // inventoryValue: formattedPrice(inventoryValue),
    };
  }, [data, currency, currentMonth, currentYear, lastMonth, lastMonthYear]);

  const setExportData = useExportStore((state) => state.setExportData);
  const clearExport = useExportStore((state) => state.clearExport);

  useEffect(() => {
    // Kita set data kosong [] tapi typenya "reports" supaya tombol PDF muncul & aktif
    setExportData([], "reports");

    return () => clearExport();
  }, []);

  return (
    <section className="w-full grid grid-cols-3 gap-4">
      {/* 1 */}
      <div className="flex items-center justify-between border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Revenue</p>
          <h1 className="text-xl font-bold">{`${validateData?.totalRevenue}`}</h1>
          <p className="text-sm text-muted-foreground">
            <span
              className={
                validateData.totalStats.currentMonthTotalRevenue <
                validateData.totalStats.lastMonthTotalRevenue
                  ? "text-red-500"
                  : "text-green-600"
              }
            >
              {`${percentageDiff(validateData.totalStats.currentMonthTotalRevenue, validateData.totalStats?.lastMonthTotalRevenue)}% `}
            </span>
            from last period
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
            <span
              className={
                validateData.totalStats.currentMonthTotalExpenses <
                validateData.totalStats.lastMonthTotalExpenses
                  ? "text-red-500"
                  : "text-green-600"
              }
            >
              {`${percentageDiff(validateData.totalStats.currentMonthTotalExpenses, validateData.totalStats?.lastMonthTotalExpenses)}% `}
            </span>
            from last period
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
          <h1 className="text-xl font-bold">{`${formattedPrice(validateData.net.currentMonth)}`}</h1>
          <p className="text-sm text-muted-foreground">
            <span
              className={
                validateData.net.currentMonth < validateData.net.lastMonth
                  ? "text-red-500"
                  : "text-green-600"
              }
            >
              {`${percentageDiff(validateData.net.currentMonth, validateData.net.lastMonth)}% `}
            </span>
            from last period
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
