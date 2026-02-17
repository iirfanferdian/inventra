"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SidebarCollapseButton({
  className,
  size,
  mode,
}: {
  className?: string;
  size?: number;
  mode?: "mobile";
}) {
  const { toggleSidebar, state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={`${cn(className)} cursor-pointer`}
          onClick={toggleSidebar}
          tooltip={state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {state === "expanded" ? (
            <>
              <PanelLeftClose size={size} />
              {!mode && <span>Collapse</span>}
            </>
          ) : (
            <PanelLeftOpen size={size} />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
