import { prisma } from "@/lib/prisma";
import { useQuery } from "@tanstack/react-query";

const getItems = async (userId: string) => {
  const response = await prisma.item.findMany({ where: { userId } });
  return response;
};

export const useItem = (userId: string) => {
  return useQuery({ queryKey: ["items"], queryFn: () => getItems(userId) });
};
