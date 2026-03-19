import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";
import SelectionButtons from "./(components)/SelectionButtons";
import Section from "./(components)/Section";

const page = async () => {
  return (
    <div className="w-full min-h-screen p-4">
      <header className="flex flex-col">
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </header>

      <SelectionButtons />

      <Section />
      <div className="bottom-10 sticky md:hidden lg:hidden">
        <SidebarCollapseButton mode="mobile" />
      </div>
    </div>
  );
};

export default page;
