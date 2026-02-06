"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListFilter } from "lucide-react";
import { useState } from "react";

export function FilterDropdown() {
  const [filter, setFilter] = useState("all");

  const filterLabels: Record<string, string> = {
    all: "All Status",
    inStock: "In Stock",
    lowStock: "Low Stock",
    outStock: "Out of Stock",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-full w-[160px] justify-between font-medium focus-visible:ring-0"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <ListFilter className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{filterLabels[filter]}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      {/* Perubahan: w-[--radix-dropdown-menu-trigger-width] agar lebar menu sama dengan tombol */}
      <DropdownMenuContent className="w-[160px]" align="start">
        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
          <DropdownMenuRadioItem value="all" className="cursor-pointer">
            All Status
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="inStock" className="cursor-pointer">
            In Stock
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="lowStock" className="cursor-pointer">
            Low Stock
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="outStock" className="cursor-pointer">
            Out of Stock
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
