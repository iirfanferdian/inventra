import { Search, User } from "lucide-react";
import React from "react";

const InventraHeader = () => {
  return (
    <div className="w-full flex justify-between p-2 bg-background border-b border-muted-background">
      <div>
        <Search />
      </div>
      <div>
        <User />
      </div>
    </div>
  );
};

export default InventraHeader;
