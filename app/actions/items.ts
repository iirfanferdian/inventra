"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const addNewItem = async (req: any) => {
  const session = await auth();
  const { item, sku, stock, minStock, price, category, description } = req;
  console.log(category);

  await prisma.item.create({
    data: {
      name: item,
      sku,
      currentStock: stock,
      minStock: minStock || 0,
      price,
      description,
      user: {
        connect: { id: session?.user?.id },
      },
      ...(category && {
        category: {
          connectOrCreate: {
            where: {
              name_userId: {
                name: category,
                userId: session?.user?.id,
              },
            },
            create: {
              name: category,
              userId: session?.user?.id,
            },
          },
        },
      }),
    },
  });
};

export const getItems = async () => {
  const session = await auth();
  const items = await prisma.item.findMany({
    where: { userId: session?.user?.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  // Map data untuk mengubah Decimal & Date menjadi Plain Types
  return items.map((item) => ({
    ...item,
    price: item.price.toNumber(), // Ubah Decimal ke Number
    createdAt: item.createdAt.toISOString(), // Ubah Date ke String
    updatedAt: item.updatedAt.toISOString(),
  }));
};

export const deleteItem = async (itemId) => {
  await prisma.item.delete({ where: { id: itemId } });
};
