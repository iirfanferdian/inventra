import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: "IDR",
      setCurrency: (newCurrency: string) => set({ currency: newCurrency }),
    }),
    {
      name: "currency",
    },
  ),
);

export const formattedPrice = (price: number, currency: string = "") => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency ? currency : "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price));
};
