"use client";
import { Search } from "lucide-react";
import UserButton from "./UserButton";
import { ToggleButton } from "./ToggleButton";
import { useRouter, useSearchParams } from "next/navigation";

const InventraHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryFromUrl = searchParams.get("q") || "";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = formData.get("inventorySearch") as string;

    if (query?.trim()) {
      router.push(`/inventory?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/inventory");
    }
  };

  return (
    <div className="w-full h-auto grid grid-cols-2 items-center p-2 bg-primary-5 border-b border-muted-background">
      <div className="relative pl-6">
        <Search
          size={16}
          className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <form onSubmit={handleSearch}>
          <input
            name="inventorySearch"
            key={queryFromUrl}
            defaultValue={queryFromUrl}
            className="bg-muted-foreground/10 rounded-md pl-10 pr-4 py-1.5 w-2/3 outline-none ring-offset-2 focus:ring-primary focus:ring-2 text-foreground text-sm transition-all"
            placeholder="Search inventory..."
            type="text"
            autoComplete="off"
          />
        </form>
      </div>
      <div className="pr-8 flex flex-row-reverse gap-4">
        <UserButton />
        <div className="flex items-center">
          <ToggleButton />
        </div>
      </div>
    </div>
  );
};

export default InventraHeader;
