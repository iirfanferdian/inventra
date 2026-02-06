"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchItemInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-background rounded-md pl-8 py-3 w-full outline-none ring-offset-2 focus:ring-primary focus:ring-2 dark:focus:ring-0 text-muted-foreground text-sm"
        placeholder="Search by name or SKU..."
      />
    </div>
  );
};

export default SearchItemInput;
