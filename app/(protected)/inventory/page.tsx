import { SidebarCollapseButton } from "@/components/ui/SidebarCollapseButton";

const page = async () => {
  return (
    <>
      <h1>Inventory</h1>
      <div className="bottom-10 absolute md:hidden lg:hidden">
        <SidebarCollapseButton mode="mobile" />
      </div>
    </>
  );
};

export default page;
