"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

import { ChevronDown, ListFilter } from "lucide-react";

export function FilterDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Take category params URL, default "all"
  const status = searchParams.get("status") || "all";

  const filterLabels: Record<string, string> = {
    all: "All Status",
    onStock: "On Stock",
    lowStock: "Low Stock",
    outStock: "Out of Stock",
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
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
            <span className="truncate">{filterLabels[status]}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[160px]" align="start">
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={handleStatusChange}
        >
          <DropdownMenuRadioItem value="all" className="cursor-pointer">
            All Status
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="onStock" className="cursor-pointer">
            On Stock
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
