import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";

const TransactionCards = () => {
  return (
    <section className="w-full grid grid-cols-3 gap-4">
      {/* 1 */}
      <div className="flex items-center justify-between border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Stock In</p>
          <h1 className="text-2xl font-bold text-green-600/80">
            Rp 487.650.000
          </h1>
        </div>
        <ArrowDownRight
          size={50}
          className="bg-green-600/10 p-2 text-green-600 rounded-lg"
        />
      </div>

      {/* 2 */}
      <div className="flex justify-between items-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <div>
          <p className="text-muted-foreground">Total Inventory Value</p>
          <h1 className="text-2xl font-bold text-red-600/80">Rp 487.650.000</h1>
        </div>
        <ArrowUpRight
          size={50}
          className="bg-red-600/10 p-2 text-red-600/80 rounded-lg"
        />
      </div>

      {/* 3 */}
      <div className="flex flex-col justify-center border border-muted-background h-auto my-8 p-6 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <p className="text-muted-foreground">Net Movement</p>
        <h1 className="text-2xl font-bold">Rp 487.650.000</h1>
      </div>
    </section>
  );
};

export default TransactionCards;
