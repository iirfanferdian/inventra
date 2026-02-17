import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import OverviewCards from "./(components)/OverviewCards";
import OverviewCharts from "./(components)/OverviewCharts";
import { TransactionsTable } from "./(components)/TransactionsTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const page = async () => {
  return (
    <div className="w-full min-h-screen p-4">
      <header>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory and financial performance
        </p>
      </header>
      <OverviewCards />
      <OverviewCharts />
      <div className="flex p-4 flex-col w-full h-auto justify-center border border-muted-background bg-background rounded-lg hover:shadow-lg transition-shadow">
        <header className="flex p-1 items-center justify-between">
          <h2 className="border-b-0 pb-0">Recent Transactions</h2>
          <Link
            href={"/transactions"}
            className="flex gap-2 text-primary hover:bg-muted-foreground/10 p-2 rounded-lg"
          >
            View All <ArrowRight className="" />
          </Link>
        </header>
        <TransactionsTable />
      </div>
      {/* Toggle Button */}
      <div className="bottom-10 absolute md:hidden lg:hidden">
        <SidebarCollapseButton mode="mobile" />
      </div>
    </div>
  );
};

export default page;
