import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import OverviewCards from "./(components)/OverviewCards";

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
      {/* Toggle Button */}
      <div className="bottom-10 absolute md:hidden lg:hidden">
        <SidebarCollapseButton mode="mobile" />
      </div>
    </div>
  );
};

export default page;
