import { auth } from "@/auth";
import { AppSidebar } from "@/components/AppSidebar";
import InventraHeader from "@/components/InventraHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import React from "react";

const InventraLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-primary/5 w-full min-h-screen">
        <SessionProvider session={session}>
          <InventraHeader />
          {children}
        </SessionProvider>
      </main>
    </SidebarProvider>
  );
};

export default InventraLayout;
