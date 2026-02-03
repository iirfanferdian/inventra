import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SelectionButtons = () => {
  return (
    <ToggleGroup
      className="bg-primary-background text-muted-foreground mt-8"
      variant="outline"
      type="single"
      defaultValue="general"
      //   onValueChange
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
