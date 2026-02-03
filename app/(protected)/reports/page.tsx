import { Button } from "@/components/ui/button";
import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import { Plus } from "lucide-react";

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
          <Button className="bg-primary hover:bg-primary/80 dark:text-foreground ">
            <Plus /> Add New Item{" "}
          </Button>
        </header>
        <div className="bottom-10 absolute md:hidden lg:hidden">
          <SidebarCollapseButton mode="mobile" />
        </div>
      </div>
    </>
  );
};

export default page;
