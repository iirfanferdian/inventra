"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const createTransaction = async (req: any) => {
  const session = await auth();

  // Proteksi jika session tidak ada
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const { itemId, date, price, quantityItem, type, note } = req;
  const operationValue = type === "IN" ? quantityItem : -quantityItem;

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          itemId,
          priceAtTransaction: price,
          type,
          note,
          quantity: quantityItem,
          userId: session.user?.id as string,
          createdAt: new Date(date),
        },
      });

      const updateItem = await tx.item.update({
        where: {
          id: itemId,
          userId: session.user?.id,
        },
        data: { currentStock: { increment: operationValue } },
      });

      // Validasi Stok Minus
      if (updateItem.currentStock < 0) {
        throw new Error("OUT_OF_STOCK");
      }

      return {
        ...updateItem,
        price: updateItem.price?.toNumber() || 0,
        currentStock: updateItem.currentStock,
      };
    });

    return { success: true, message: "Transaction Create Successfully" };
  } catch (e: any) {
    if (e.message === "OUT_OF_STOCK") {
      return {
        success: false,
        message: "The item is Out Of Stock / Item stock result might be minus",
      };
    }

    if (e.code === "P2002") {
      return { success: false, message: "Duplicated transaction detected" };
    }

    console.error("Transaction Error:", e);
    return {
      success: false,
      message: "Unknown System Error",
    };
  }
};

export const getTransaction = async (type: "all") => {
  const session = await auth();
  const result = await prisma.transaction.findMany({
    where: {
      userId: session?.user?.id,
      type: type === "all" ? undefined : type,
    },
    include: { item: true },
    orderBy: { createdAt: "desc" },
  });

  //Format the decimal to type that support by client
  const serializedData = result.map((transaction) => ({
    ...transaction,
    priceAtTransaction: transaction.priceAtTransaction.toNumber(),

    item: transaction.item
      ? {
          ...transaction.item,
          price: transaction.item.price ? Number(transaction.item.price) : 0,
        }
      : null,
  }));
  return {
    success: true,
    data: serializedData,
    message: "Transaction Get Successfully",
  };
};
