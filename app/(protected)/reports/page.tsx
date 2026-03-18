import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Download, Plus } from "lucide-react";
import ReportCards from "./(components)/ReportCards";
import ReportCharts from "./(components)/ReportCharts";
import { ProfitTrend } from "./(components)/ProfitTrend";
import ExportButton from "@/components/ExportButton";

const page = async () => {
  return (
    <>
      <div className="w-full min-h-screen p-4">
        <header className="flex justify-between items-center">
          <div>
            <h1>Reports</h1>
            <p className="text-muted-foreground">
              Analyze your business performance and trends
            </p>
          </div>
          <ExportButton />
        </header>
        <div></div>
        <div id="report-area" className="space-y-6 transition-all">
          <ReportCards />
          <ReportCharts />
          <ProfitTrend />
        </div>
        <div className="bottom-10 absolute md:hidden lg:hidden">
          <SidebarCollapseButton mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
