"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";

const SelectionButtons = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const section = searchParams.get("section") || "general";

  const handleSectionChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "general") {
      params.delete("section");
    } else {
      params.set("section", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <ToggleGroup
      className="bg-primary-background text-muted-foreground mt-8"
      variant="outline"
      type="single"
      defaultValue="general"
      value={section}
      onValueChange={handleSectionChange}
      spacing={2}
    >
      <ToggleGroupItem
        className="bg-muted-foreground/5 data-[state=on]:bg-background"
        value="general"
        aria-label="Toggle General"
      >
        General
      </ToggleGroupItem>
      <ToggleGroupItem
        className="bg-muted-foreground/5 data-[state=on]:bg-background"
        value="notifications"
        aria-label="Toggle Notifications"
      >
        Notifications
      </ToggleGroupItem>
      <ToggleGroupItem
        className="bg-muted-foreground/5 data-[state=on]:bg-background"
        value="security"
        aria-label="Toggle Security"
      >
        Security
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SelectionButtons;
