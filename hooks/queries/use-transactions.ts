import { getTransaction } from "@/app/actions/transactions";
import { queryOptions } from "@tanstack/react-query";

export const TransactionQueryOptions = {
  all: (type: any) =>
    queryOptions({
      queryKey: ["transactions", type],
      queryFn: () => getTransaction(type),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }),
};
