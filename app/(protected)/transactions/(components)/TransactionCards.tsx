"use client";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { formattedPrice, useCurrencyStore } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, LoaderCircle } from "lucide-react";
import React, { useMemo } from "react";

const TransactionCards = () => {
  const { data, isPending } = useQuery(TransactionQueryOptions.all());

  const currency = useCurrencyStore((state) => state.currency);

  const formattedData = useMemo(() => {
    // Check data
    if (!data) return;

    let stockIn = 0;
    let stockOut = 0;
    let net = 0;

    //Calculate Function
    const calculateData = data?.data?.map((transaction) => {
      if (transaction?.type === "IN") {
        stockIn += transaction.quantity * transaction.priceAtTransaction;
      }
      if (transaction?.type === "OUT") {
        stockOut += transaction.quantity * transaction.priceAtTransaction;
      }

      net = stockIn + -stockOut;
    });

    return {
      stockIn: formattedPrice(stockIn, currency),
      stockOut: formattedPrice(stockOut, currency),
      net: formattedPrice(net, currency),
    };
  }, [data, currency]);

  return (
    <section className="w-full grid grid-cols-3 gap-4">
      {/* 1 */}
      <div className="flex items-center justify-between border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Stock In</p>
          <h1 className="text-2xl font-bold text-green-600/80">
            {isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              `${formattedData?.stockIn}`
            )}
          </h1>
        </div>
        <ArrowDownRight
          size={50}
          className="bg-green-600/10 p-2 text-green-600 rounded-lg"
        />
      </div>

      {/* 2 */}
      <div className="flex justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Stock Out</p>
          <h1 className="text-2xl font-bold text-red-600/80">
            {isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              `${formattedData?.stockOut}`
            )}
          </h1>
        </div>
        <ArrowUpRight
          size={50}
          className="bg-red-600/10 p-2 text-red-600/80 rounded-lg"
        />
      </div>

      {/* 3 */}
      <div className="flex flex-col justify-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Net Inflow - Outflow</p>
        <h1 className="text-2xl font-bold">
          {" "}
          {isPending ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            `${formattedData?.net}`
          )}
        </h1>
      </div>
    </section>
  );
};

export default TransactionCards;
