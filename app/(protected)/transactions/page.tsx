import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Download, Plus } from "lucide-react";
import TransactionCards from "./(components)/TransactionCards";
import { TransactionsFilter } from "./(components)/TransactionsFilter";
import { TransactionsTable } from "./(components)/TransactionsTable";
import { AddNewTransactionButton } from "./(components)/AddNewTransactionButton";
import ExportButton from "@/components/ExportButton";

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
          <AddNewTransactionButton />
        </header>
        {/* Cards Section */}
        <TransactionCards />

        {/* Filter and Export Section */}
        <section className="flex justify-between mb-6">
          <TransactionsFilter />
          <ExportButton />
        </section>

        {/* Table Section */}

        <TransactionsTable />

        <div className="bottom-10 sticky md:hidden lg:hidden">
          <SidebarCollapseButton mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
