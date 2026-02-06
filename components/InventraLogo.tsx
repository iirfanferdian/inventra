import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Box } from "lucide-react";

const InventraLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="#">
            {/* Logo Aplikasi */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Box className="dark:text-foreground size-4" />
            </div>

            {/* Judul & Deskripsi - Otomatis tersembunyi saat collapse */}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Inventra</span>
              <span className="truncate text-xs text-muted-foreground">
                Enterprise Edition
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default InventraLogo;
