export const getLast6Months = () => {
  const months = [];
  const now = new Date();

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push({
      month: d.getMonth(),
      year: d.getFullYear(),
      period: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }

  return months;
};
