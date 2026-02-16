export const formatMonth = (months: number[]): { month: string }[] => {
  return months.map((key) => {
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      key,
    );
    return { month: month };
  });
};
