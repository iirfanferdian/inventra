"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Package, Trash2 } from "lucide-react";

import { deleteItem } from "@/app/actions/items";
import { ItemQueryOptions } from "@/hooks/queries/use-items";
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

// 1. Konfigurasi Status (Single Source of Truth)
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

  // Get URL PARAMS
  const category = searchParams.get("category") || undefined;
  const statusFilter = searchParams.get("status") || "all";
  const searchValue = searchParams.get("q") || undefined;

  // Fetch Data
  const { data, isPending: queryPending } = useQuery(
    ItemQueryOptions.all({ category }),
  );

  // Delete Mutation
  const { mutate, isPending, variables } = useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
    onSuccess: async () => {
      // Invalidate
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["category"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
      ]);
    },
  });

  // Data for render usage (Processing Data for min stock and currency) IMPORTANT BEFORE RENDER for efficiency
  const processedItems = useMemo(() => {
    if (!data) return [];

    // Get the formated data
    const mapped = data.map((item) => {
      // get the data min stock
      const effectiveMinStock = item.minStock || 5;
      // Set status key to STATUS_CONFIG with default "onStock"
      let statusKey: keyof typeof STATUS_CONFIG = "onStock";

      // Check current stock to set the statusKey
      if (item.currentStock <= 0) {
        statusKey = "outStock";
      } else if (item.currentStock < effectiveMinStock) {
        statusKey = "lowStock";
      }

      // Calculated progress bar (max 100%)
      const maxCap = Math.max(effectiveMinStock * 2, 20);
      const progressValue = Math.min((item.currentStock / maxCap) * 100, 100);

      // Return the data to mapped variable
      return {
        ...item,
        statusKey,
        status: STATUS_CONFIG[statusKey],
        progressValue,
        formattedPrice: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(Number(item.price)),
      };
    });
    //Set filtered to clean data without filter
    let filtered = mapped;
    // Then check Filter By statusFilter from URL if it's not all add the status filter to filtered var
    if (statusFilter !== "all") {
      filtered = mapped.filter((item) => item.statusKey === statusFilter);
    }

    // Check if params of searchValue {"q?"} exists, then add the filter it and overwrite to filtered value
    if (searchValue) {
      const lowerQuery = searchValue.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLocaleLowerCase().includes(lowerQuery) ||
          item.sku.toLocaleLowerCase().includes(lowerQuery),
      );
    }

    //Return the result filtered
    return filtered;
  }, [data, statusFilter, searchValue]);

  // Loader if query of getting items is pending
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

  //Return all the data from processedItems
  return (
    <div className="rounded-md border bg-card">
      <Table>
        {/* Table Header */}
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
          {/* Set logic for Table Items to render item in Client */}
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
                  {/* Info Product */}
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

                  {/* Stock Level & Progress */}
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

                  {/* Actions */}
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
