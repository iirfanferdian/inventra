import React from "react";

const InventraLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <aside></aside>
      <main>{children}</main>
    </div>
  );
};

export default InventraLayout;
