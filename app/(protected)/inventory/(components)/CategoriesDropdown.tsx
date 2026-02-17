"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ItemQueryOptions } from "@/hooks/queries/use-items";

export function CategoriesDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Take category params URL, default "all"
  const category = searchParams.get("category") || "all";

  const { data: categories } = useQuery(ItemQueryOptions.category());

  const categoryLabel = useMemo(() => {
    const labels: Record<string, string> = { all: "All Categories" };
    categories?.forEach((cat) => {
      labels[cat.name] = cat.name;
    });
    return labels;
  }, [categories]);

  //Category Handle
  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
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
          <span className="truncate">
            {categoryLabel[category] || "Select..."}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[160px]" align="start">
        <DropdownMenuRadioGroup
          value={category}
          onValueChange={handleCategoryChange}
        >
          <DropdownMenuRadioItem value="all" className="cursor-pointer">
            All Categories
          </DropdownMenuRadioItem>
          {categories?.map((cat) => (
            <DropdownMenuRadioItem
              key={cat.id}
              value={cat.name}
              className="cursor-pointer"
            >
              {cat.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
