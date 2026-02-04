"use server";

import { prisma } from "@/lib/prisma";
import { Item } from "../generated/prisma/client";

export const addNewItem = async (data: Item) => {
  const { name, description, sku, categoryId, currentStock, price } =
    await prisma.item.create({ data });
  const result = { name, description, sku, categoryId, currentStock, price };
  return result;
};
