import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Download, Search } from "lucide-react";
import { FilterDropdown } from "./(components)/FilterDropdown";
import { CategoriesDropdown } from "./(components)/CategoriesDropdown";
import { ItemsTable } from "./(components)/ItemsTable";
import { NewItemButton } from "./(components)/AddNewItemButton";
import SearchItemInput from "./(components)/SearchItemInput";

const page = async () => {
  return (
    <>
      <div className="w-full min-h-screen p-4">
        <header className="flex justify-between items-center">
          <div>
            <h1>Inventory</h1>
            <p className="text-muted-foreground">
              Manage your products and stock levels
            </p>
          </div>
          <NewItemButton />
        </header>

        {/* Section */}
        <section className="flex my-6 w-full">
          <div className="flex w-3/4 items-center gap-4">
            <SearchItemInput />
            <FilterDropdown />
            <CategoriesDropdown />
          </div>
          <div className="flex items-center justify-end w-1/2">
            <Button className="bg-primary dark:text-foreground text-primary-foreground">
              <Download /> Export
            </Button>
          </div>
        </section>
        <ItemsTable />
        <div className="bottom-10 absolute md:hidden lg:hidden">
          <SidebarCollapseButton className="fixed" mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
