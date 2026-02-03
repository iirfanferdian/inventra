import React from "react";
import { CashFlowChart } from "./CashFlowChart";
import { StockDistributionChart } from "./StockDistributionChart";

const OverviewCharts = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-3 w-full">
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto my-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <CashFlowChart />
      </div>
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto my-8 p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <StockDistributionChart />
      </div>
    </div>
  );
};

export default OverviewCharts;
