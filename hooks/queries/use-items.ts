import { getItemCategory, getItems } from "@/app/actions/items";
import { queryOptions } from "@tanstack/react-query";

export const ItemQueryOptions = {
  all: (filters = { category: "all", status: "all" }) =>
    queryOptions({
      queryKey: ["items", filters] as const,
      queryFn: () => getItems(filters),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }),
  category: () =>
    queryOptions({
      queryKey: ["category"],
      queryFn: getItemCategory,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }),
};
