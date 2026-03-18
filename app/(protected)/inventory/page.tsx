import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { FilterDropdown } from "./(components)/FilterDropdown";
import { CategoriesDropdown } from "./(components)/CategoriesDropdown";
import { ItemsTable } from "./(components)/ItemsTable";
import { NewItemButton } from "./(components)/AddNewItemButton";
import SearchItemInput from "./(components)/SearchItemInput";
import ExportButton from "@/components/ExportButton";

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
            <ExportButton />
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
