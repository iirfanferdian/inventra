import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import SelectionButtons from "./(components)/SelectionButtons";
import General from "./(components)/General";
import Notifications from "./(components)/Notifications";

const page = async () => {
  return (
    <div className="w-full min-h-screen p-4">
      <header className="flex flex-col">
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Analyze your business performance and trends
        </p>
      </header>

      <SelectionButtons />

      {/* <General /> */}

      <Notifications />

      <div className="bottom-10 absolute md:hidden lg:hidden">
        <SidebarCollapseButton mode="mobile" />
      </div>
    </div>
  );
};

export default page;
