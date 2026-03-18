"use client";

import { useMemo, useEffect } from "react"; // Tambah useEffect
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Package, Trash2 } from "lucide-react";

import { deleteItem } from "@/app/actions/items";
import { ItemQueryOptions } from "@/hooks/queries/use-items";
import { useExportStore } from "@/hooks/use-export-store"; // Import store kamu
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AlertWindow from "./AlertWindow";
import { formattedPrice, useCurrencyStore } from "@/utils/formatPrice";

const STATUS_CONFIG = {
  onStock: {
    label: "On Stock",
    color: "text-green-400 bg-green-500/10 dark:bg-green-500/30",
  },
  lowStock: {
    label: "Low Stock",
    color: "text-yellow-400 bg-yellow-500/10 dark:bg-yellow-500/30",
  },
  outStock: {
    label: "Out of Stock",
    color: "text-red-400 bg-red-500/10 dark:bg-red-500/30",
  },
};

export function ItemsTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Ambil fungsi set dan clear dari store
  const setExportData = useExportStore((state) => state.setExportData);
  const clearExport = useExportStore((state) => state.clearExport);

  const category = searchParams.get("category") || undefined;
  const statusFilter = searchParams.get("status") || "all";
  const searchValue = searchParams.get("q") || undefined;

  const { data, isPending: queryPending } = useQuery(
    ItemQueryOptions.all({ category }),
  );

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["category"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
      ]);
    },
  });

  const currency = useCurrencyStore((state) => state.currency);

  const processedItems = useMemo(() => {
    if (!data) return [];

    const mapped = data.map((item) => {
      const effectiveMinStock = item.minStock || 5;
      let statusKey: keyof typeof STATUS_CONFIG = "onStock";

      if (item.currentStock <= 0) {
        statusKey = "outStock";
      } else if (item.currentStock < effectiveMinStock) {
        statusKey = "lowStock";
      }

      const maxCap = Math.max(effectiveMinStock * 2, 20);
      const progressValue = Math.min((item.currentStock / maxCap) * 100, 100);

      return {
        ...item,
        statusKey,
        status: STATUS_CONFIG[statusKey],
        progressValue,
        formattedPrice: formattedPrice(item.price, currency),
      };
    });

    let filtered = mapped;
    if (statusFilter !== "all") {
      filtered = mapped.filter((item) => item.statusKey === statusFilter);
    }

    if (searchValue) {
      const lowerQuery = searchValue.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLocaleLowerCase().includes(lowerQuery) ||
          item.sku.toLocaleLowerCase().includes(lowerQuery),
      );
    }

    return filtered;
  }, [data, statusFilter, searchValue, currency]);

  // --- LOGIKA EXPORT SYNC ---
  useEffect(() => {
    // 1. Simpan ke store saat data berubah (atau saat mount)
    if (processedItems.length > 0) {
      setExportData(processedItems, "inventory");
    }

    // 2. Cleanup Function: Terpanggil saat ganti page / unmount
    return () => {
      clearExport();
    };
  }, [processedItems, setExportData, clearExport]);

  if (queryPending) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <LoaderCircle className="animate-spin text-primary" size={60} />
        <p className="mt-4 text-muted-foreground animate-pulse">
          Loading inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Item</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[200px]">Stock Level</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                {statusFilter !== "all"
                  ? `No items with status "${statusFilter}" found.`
                  : "No items found."}
              </TableCell>
            </TableRow>
          ) : (
            processedItems?.map((item) => {
              const isDeleting = isPending && variables === item.id;
              return (
                <TableRow
                  key={item?.id}
                  className={isDeleting ? "opacity-40 select-none" : ""}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Package size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold leading-none mb-1">
                          {item?.name}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 italic">
                          {item?.description || "No description provided"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs uppercase tracking-wider">
                    {item?.sku}
                  </TableCell>
                  <TableCell>
                    {item?.category?.name ? (
                      <Badge variant="outline" className="font-medium">
                        {item?.category?.name}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Uncategorized
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold">
                        {item?.currentStock}{" "}
                        <span className="text-muted-foreground font-normal">
                          units
                        </span>
                      </span>
                      <Badge
                        className={`${item?.status?.color} border-none text-[10px] px-2 h-5`}
                      >
                        {item?.status?.label}
                      </Badge>
                    </div>
                    <Progress value={item?.progressValue} className="h-1.5" />
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {item?.formattedPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      {isDeleting ? (
                        <LoaderCircle
                          className="animate-spin text-muted-foreground"
                          size={18}
                        />
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertWindow item={item} mutate={mutate} />
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
