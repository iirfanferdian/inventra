const OverviewCards = () => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 w-full justify-center">
      {/* 1 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto my-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Total Inventory Value</p>
        <h1 className="text-2xl font-bold">Rp 487.650.000</h1>
        <p className="text-muted-foreground">
          <span>+12.5%</span> vs last month
        </p>
      </div>

      {/* 2 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto my-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Total Inventory Value</p>
        <h1 className="text-2xl font-bold">Rp 487.650.000</h1>
        <p className="text-muted-foreground">
          <span>+12.5%</span> vs last month
        </p>
      </div>

      {/* 3 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto my-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Total Inventory Value</p>
        <h1 className="text-2xl font-bold">Rp 487.650.000</h1>
        <p className="text-muted-foreground">
          <span>+12.5%</span> vs last month
        </p>
      </div>

      {/* 4 */}
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto my-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Total Inventory Value</p>
        <h1 className="text-2xl font-bold">Rp 487.650.000</h1>
        <p className="text-muted-foreground">
          <span>+12.5%</span> vs last month
        </p>
      </div>
    </div>
  );
};

export default OverviewCards;
