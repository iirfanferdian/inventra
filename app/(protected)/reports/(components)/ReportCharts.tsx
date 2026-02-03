import { StockDistributionChart } from "../../dashboard/(components)/StockDistributionChart";
import { ReportBarChart } from "./ReportBarChart";

const ReportCharts = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-3 w-full">
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <ReportBarChart />
      </div>
      <div className="flex flex-col gap-2 justify-center border border-muted-background h-auto p-3 bg-background rounded-lg hover:shadow-lg transition-shadow">
        <StockDistributionChart />
      </div>
    </div>
  );
};

export default ReportCharts;
