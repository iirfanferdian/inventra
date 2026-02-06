"use client";
import { deleteItem } from "@/app/actions/items";
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

import { ItemQueryOptions } from "@/hooks/queries/use-items";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Package, Trash2 } from "lucide-react";
import AlertWindow from "./AlertWindow";
import { useSearchParams } from "next/navigation";

export function ItemsTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Take category params URL, default "all"
  const category = searchParams.get("category") || undefined;

  //Insert category params in here
  const { data, isPending: queryPending } = useQuery(
    ItemQueryOptions.all({ category }),
  );

  // Delete Item Mutation
  const { mutate, isPending, variables } = useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["items"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["category"],
        }),
      ]);
    },
  });

  if (queryPending) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <LoaderCircle className="animate-spin text-primary" size={60} />
      </div>
    );
  }

  return (
    <Table className="rounded-lg bg-background border">
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock Level</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-10 text-muted-foreground"
            >
              No items found.
            </TableCell>
          </TableRow>
        ) : (
          data?.map((item) => {
            // Cek apakah item ini sedang dalam proses delete
            const isDeleting = isPending && variables === item.id;

            return (
              <TableRow
                key={item.id}
                className={isDeleting ? "opacity-50" : ""}
              >
                <TableCell className="font-medium flex gap-2">
                  <Package
                    size={35}
                    className="p-1 text-muted-foreground bg-muted-foreground/20 rounded-lg"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {item.description || "No description"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>
                  {item.category?.name || (
                    <span className="text-muted-foreground italic text-xs">
                      Uncategorized
                    </span>
                  )}
                </TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell className="text-right">
                  {/* Pastikan formatting harga rapi */}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(item.price)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {isPending && variables === item.id ? (
                      <LoaderCircle
                        className="animate-spin text-muted-foreground"
                        size={18}
                      />
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {/* Tombol pemicu dialog */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
  );
}
