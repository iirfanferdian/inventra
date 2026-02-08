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
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const TYPE_CONFIG = {
  IN: {
    key: "IN",
    label: "Stock In",
    color: "text-green-400 bg-green-500/10 dark:bg-green-500/30",
  },
  OUT: {
    key: "OUT",
    label: "Stock Out",
    color: "text-red-400 bg-red-500/10 dark:bg-red-500/30",
  },
};

export function TransactionsTable() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "all";

  // Karena kita sudah mengirim 'type' ke useQuery, filtering biasanya sudah dilakukan di sisi server
  const { data, isLoading } = useQuery(
    TransactionQueryOptions.all(type === "all" ? undefined : type),
  );

  const validateData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((transaction: any) => {
      // Pastikan config tersedia agar tidak error saat akses .color atau .label
      const config =
        TYPE_CONFIG[transaction.type as keyof typeof TYPE_CONFIG] ||
        TYPE_CONFIG.IN;

      return {
        ...transaction,
        ui: config, // Simpan ke properti 'ui' supaya tidak menimpa string asli 'type'
        formattedDate: format(new Date(transaction.createdAt), "dd MMM yyyy"),
        formattedPrice: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(Number(transaction.priceAtTransaction)),
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-32 w-full items-center justify-center">
        <LoaderCircle className="mr-2 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  return (
    <Table className="rounded-lg bg-background">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {validateData.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-32 text-center text-muted-foreground"
            >
              {type !== "all"
                ? `No transactions for "${type}" found.`
                : "No transactions found."}
            </TableCell>
          </TableRow>
        ) : (
          /* PERBAIKAN: Hapus kurung kurawal ekstra dan gunakan map langsung */
          validateData.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-muted-foreground">
                {transaction.formattedDate}
              </TableCell>
              <TableCell className="font-medium">
                {transaction?.item?.name || "Deleted Item"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`flex w-fit items-center gap-1 ${transaction.ui.color}`}
                >
                  {transaction.type === "IN" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {transaction.ui.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {transaction.quantity}
              </TableCell>
              <TableCell className="text-right font-mono">
                {transaction.formattedPrice}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {transaction.note || "-"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
