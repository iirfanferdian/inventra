export const percentageDiff = (
  currentMonthTotal: number,
  lastMonthTotal: number,
) => {
  // 1. Selisih Angka Mutlak
  const difference = currentMonthTotal - lastMonthTotal;

  // 2. Selisih Persentase (%)
  // Rumus: ((Baru - Lama) / Lama) * 100
  const percentageChange =
    lastMonthTotal !== 0 ? ((difference / lastMonthTotal) * 100).toFixed(2) : 0;

  return Number(percentageChange) >= 0
    ? "+" + percentageChange
    : "" + percentageChange;
};
