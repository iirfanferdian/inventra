import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Download, Plus } from "lucide-react";
import TransactionCards from "./(components)/TransactionCards";
import { TransactionsFilter } from "./(components)/TransactionsFilter";
import { TransactionsTable } from "./(components)/TransactionsTable";

const page = async () => {
  return (
    <>
      <div className="w-full min-h-screen p-4">
        <header className="flex justify-between items-center">
          <div>
            <h1>Transactions</h1>
            <p className="text-muted-foreground">
              Track all stock movements and financial transactions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/80 dark:text-foreground ">
            <Plus /> Record Transactions{" "}
          </Button>
        </header>
        {/* Cards Section */}
        <TransactionCards />

        {/* Filter and Export Section */}
        <section className="flex justify-between mb-6">
          <TransactionsFilter />
          <Button className="bg-transparent dark:text-foreground text-foreground border border-input shadow-sm hover:bg-input text-sm">
            <Download /> Export
          </Button>
        </section>

        {/* Table Section */}

        <TransactionsTable />

        <div className="bottom-10 absolute md:hidden lg:hidden">
          <SidebarCollapseButton mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
