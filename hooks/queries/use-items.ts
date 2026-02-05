import { getItems } from "@/app/actions/items";
import { queryOptions } from "@tanstack/react-query";

export const ItemQueryOptions = {
  all: () =>
    queryOptions({
      queryKey: ["items"] as const,
      queryFn: getItems,
    }),
};
