import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Plus } from "lucide-react";
import ReportCards from "./(components)/ReportCards";
import ReportCharts from "./(components)/ReportCharts";
import { ProfitTrend } from "./(components)/ProfitTrend";

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
          <Button className="bg-primary hover:bg-primary/80 dark:text-foreground ">
            <Plus /> Export Report{" "}
          </Button>
        </header>
        {/* Cards Section */}
        <ReportCards />

        {/* 2 Charts Section */}
        <ReportCharts />

        {/* Profit Trend */}
        <ProfitTrend />
        <div className="bottom-10 absolute md:hidden lg:hidden">
          <SidebarCollapseButton mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
