import { Search } from "lucide-react";
import UserButton from "./UserButton";
import ToggleButton from "./ToggleButton";

const InventraHeader = () => {
  return (
    <div className="w-full h-auto grid grid-cols-2 items-center p-2 bg-primary-5 border-b border-muted-background">
      <div className="relative pl-6 ">
        <Search
          size={16}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          className="bg-muted-foreground/10 rounded-md pl-8 py-1.5 w-2/3 outline-none ring-offset-2 focus:ring-primary focus:ring-2 text-muted-foreground text-sm"
          placeholder="Search inventory..."
        />
      </div>
      <div className="pr-8 flex flex-row-reverse gap-4">
        <UserButton />
        <div className="flex items-center">
          <ToggleButton />
        </div>
      </div>
    </div>
  );
};

export default InventraHeader;
