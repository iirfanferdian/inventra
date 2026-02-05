"use client";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

export function NewItemButton() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IAddItem>({ mode: "onSubmit", criteriaMode: "firstError" });

  const Categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Audio", value: "audio" },
    { label: "Accessories", value: "accessories" },
    { label: "Monitors", value: "monitors" },
    { label: "Storage", value: "storage" },
    { label: "Networking", value: "networking" },
  ] as const;

  interface IAddItem {
    item: string;
    code: string;
    description?: string;
    category?: string;
    stock: number;
    minstock?: number;
    price: number;
  }

  const onSubmit: SubmitHandler<IAddItem> = async (data) => {
    console.log(data);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }
      }}
    >
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Input */}
          <FieldGroup>
            {/* Name & Code */}
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="item">Item Name*</Label>
                <Input
                  id="item"
                  placeholder="MacBook Pro 14"
                  type="text"
                  {...register("item", {
                    required: {
                      value: true,
                      message: "Please fill out this field",
                    },
                  })}
                />
                {errors?.item?.message && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.item.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="code">SKU/Code*</Label>
                <Input
                  id="code"
                  placeholder="MBP-14 M3"
                  {...register("code", {
                    required: {
                      value: true,
                      message: "Please fill out this field",
                    },
                  })}
                />
                {errors?.code?.message && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.code.message}
                  </p>
                )}
              </Field>
            </div>

            {/* Desc */}
            <Field>
              <Label htmlFor="description">Description</Label>

              <InputGroup>
                <InputGroupTextarea
                  id="description"
                  placeholder="Brief description of the item..."
                  rows={4}
                  className="min-h-24 resize-none"
                />
              </InputGroup>
            </Field>

            {/* Select Category Button */}
            <Field>
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            {/* Footer Input */}
            <div className="grid grid-cols-3 gap-3">
              {/* Field Stock */}
              <Field>
                <Label htmlFor="stock">Stock*</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  {...register("stock", {
                    required: "Stock is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                />
                {errors?.stock?.message && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.stock.message}
                  </p>
                )}
              </Field>

              {/* Field Min Stock */}
              <Field>
                <Label htmlFor="minStock">Min Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  placeholder="5"
                  {...register("minstock", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Min Stock cannot be negative" },
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                />
              </Field>

              {/* Field Price */}
              <Field>
                <Label htmlFor="price">Price*</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="100000"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be at least 0" },
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                />
                {errors?.price?.message && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              variant="outline"
              className="bg-primary text-primary-foreground dark:bg-primary dark:text-foreground hover:bg-primary/80 hover:text-primary-foreground dark:hover:bg-primary/80 dark:hover:text-foreground"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
