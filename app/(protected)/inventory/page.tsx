import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Download, LoaderCircle, Plus, Search } from "lucide-react";
import { FilterDropdown } from "./(components)/FilterDropdown";
import { CategoriesDropdown } from "./(components)/CategoriesDropdown";
import { ItemsTable } from "./(components)/ItemsTable";
import { PaginationButton } from "./(components)/PaginationButton";
import { NewItemButton } from "./(components)/AddNewItemButton";

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
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                className="bg-background rounded-md pl-8 py-3 w-full outline-none ring-offset-2 focus:ring-primary focus:ring-2 text-muted-foreground text-sm"
                placeholder="Search by name or SKU..."
              />
            </div>
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

        {/* <footer className="w-full flex justify-between my-3">
          <p>Showing 1 to 5 of 8 items</p>
          <div>
            <PaginationButton />
          </div>
        </footer> */}
        <div className="bottom-10 absolute md:hidden lg:hidden">
          <SidebarCollapseButton className="fixed" mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
