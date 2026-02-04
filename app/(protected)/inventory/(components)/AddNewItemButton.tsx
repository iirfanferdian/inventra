import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function NewItemButton() {
  const Categories = [
    { label: "Electronics", value: "en" },
    { label: "Audio", value: "es" },
    { label: "Accessories", value: "fr" },
    { label: "Monitors", value: "de" },
    { label: "Storage", value: "it" },
    { label: "Networking", value: "zh" },
  ] as const;

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/80 dark:text-foreground ">
            <Plus />
            Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new item to your inventory.
            </DialogDescription>
          </DialogHeader>

          {/* Input */}
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="item">Item Name*</Label>
                <Input id="item" name="item" placeholder="MacBook Pro 14" />
              </Field>
              <Field>
                <Label htmlFor="sku">SKU/Code*</Label>
                <Input id="sku" name="sku" placeholder="MBP-14 M3" />
              </Field>
            </div>
            <Field>
              <Label htmlFor="description">Description</Label>

              <InputGroup>
                <InputGroupTextarea
                  id="form-rhf-demo-description"
                  placeholder="Brief description of the item..."
                  rows={4}
                  className="min-h-24 resize-none"
                />
              </InputGroup>
            </Field>
            <Field>
              {/* Select Button */}
              <Select>
                <Label htmlFor="categories">Category</Label>

                <SelectTrigger
                  id="form-rhf-select-language"
                  className="min-w-[120px]"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {Categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Footer Input */}

            <div className="grid grid-cols-3 gap-3">
              <Field>
                <Label htmlFor="item">Stock*</Label>
                <Input
                  id="item"
                  name="item"
                  type="number"
                  defaultValue={1}
                  min={0}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </Field>
              <Field>
                <Label htmlFor="sku">Min Stock</Label>
                <Input
                  id="sku"
                  name="sku"
                  type="number"
                  min={0}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </Field>
              <Field>
                <Label htmlFor="sku">Price</Label>
                <Input
                  id="sku"
                  name="sku"
                  type="number"
                  min={0}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
