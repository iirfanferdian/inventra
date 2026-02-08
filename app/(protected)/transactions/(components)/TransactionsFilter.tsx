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
import { useRouter, useSearchParams } from "next/navigation";

export function TransactionsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "all";

  const filterLabels: Record<string, string> = {
    all: "All Transactions",
    IN: "Stock In",
    OUT: "Stock Out",
  };

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-full w-[200px] justify-between font-medium focus-visible:ring-0"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <ListFilter className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{filterLabels[type]}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[160px]" align="start">
        <DropdownMenuRadioGroup value={type} onValueChange={handleTypeChange}>
          <DropdownMenuRadioItem value="all" className="cursor-pointer">
            All Transactions
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="IN" className="cursor-pointer">
            Stock In
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="OUT" className="cursor-pointer">
            Stock Out
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
