"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionQueryOptions } from "@/hooks/queries/use-transactions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const TYPE_CONFIG = {
  IN: {
    label: "Stock In",
    color: "text-green-400 bg-green-500/10 dark:bg-green-500/30",
  },
  OUT: {
    label: "Stock Out",
    color: "text-red-400 bg-red-500/10 dark:bg-red-500/30",
  },
};

export function TransactionsTable() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || undefined;
  const { data } = useQuery(TransactionQueryOptions.all(type));
  console.log(data);
  const validateData = useMemo(() => {
    if (!data?.data) return [];

    // Change the date format
    const formattedData = data.data.map((transaction) => ({
      ...transaction,
      type: TYPE_CONFIG[transaction.type],
      createdAt: format(new Date(transaction.createdAt), "dd MMM yyyy"),
      formattedPrice: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(transaction.priceAtTransaction)),
    }));
    return formattedData;
  }, [data]);

  return (
    <Table className="rounded-lg bg-background">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {validateData.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className=" text-muted-foreground flex gap-2">
              {transaction.createdAt}
            </TableCell>
            <TableCell>{transaction?.item?.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className={transaction.type.color}>
                {transaction.type.label === "Stock In" ? (
                  <TrendingUp />
                ) : (
                  <TrendingDown />
                )}
                {transaction.type.label}
              </Badge>
            </TableCell>
            <TableCell>{transaction.quantity}</TableCell>
            <TableCell>{transaction.formattedPrice}</TableCell>
            <TableCell className="text-muted-foreground">
              {transaction.note}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
