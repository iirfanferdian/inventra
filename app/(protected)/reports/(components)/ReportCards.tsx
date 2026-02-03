import { DollarSign, Package, TrendingDown } from "lucide-react";

const ReportCards = () => {
  return (
    <section className="w-full grid grid-cols-4 gap-4">
      {/* 1 */}
      <div className="flex items-center justify-between border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Stock In</p>
          <h1 className="text-xl font-bold text-green-600/80">
            Rp 487.650.000
          </h1>
          <p className="text-sm text-muted-foreground">
            +12.5% from last period
          </p>
        </div>
        <DollarSign
          size={30}
          className="bg-green-600/10 p-2 text-green-600 rounded-lg"
        />
      </div>

      {/* 2 */}
      <div className="flex justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Inventory Value</p>
          <h1 className="text-xl font-bold text-red-600/80">Rp 487.650.000</h1>
          <p className="text-sm text-muted-foreground">
            +5.2% from last period
          </p>
        </div>
        <TrendingDown
          size={30}
          className="bg-red-600/10 p-2 text-red-600/80 rounded-lg"
        />
      </div>

      {/* 3 */}
      <div className="flex justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Net Profit</p>
          <h1 className="text-xl font-bold">Rp 487.650.000</h1>
          <p className="text-sm text-muted-foreground">
            +18.3% from last period
          </p>
        </div>
        <TrendingDown
          size={30}
          className="bg-red-600/10 p-2 text-red-600/80 rounded-lg"
        />
      </div>

      {/* 4 */}
      <div className="flex  justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Inventory Value</p>
          <h1 className="text-xl font-bold">Rp 487.650.000</h1>
          <p className="text-sm text-muted-foreground">
            +5.2% from last period
          </p>
        </div>
        <Package
          size={30}
          className="bg-primary/10 p-2 text-primary/80 rounded-lg"
        />
      </div>
    </section>
  );
};

export default ReportCards;
