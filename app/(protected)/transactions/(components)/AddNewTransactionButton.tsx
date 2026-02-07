"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemQueryOptions } from "@/hooks/queries/use-items";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDownIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface IAddTransaction {
  itemId: string;
  type: string;
  quantity: number;
  price?: number;
  date?: Date;
  notes?: string;
}

export function AddNewTransactionButton() {
  const [open, setOpen] = useState(false);

  const { data: itemData } = useQuery(ItemQueryOptions.all());

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IAddTransaction>({
    mode: "onSubmit",
    defaultValues: {
      itemId: "", // Tambahkan ini agar tidak undefined
      type: "", // Tambahkan ini agar tidak undefined
      quantity: 0, // Standarkan ke 0 agar tidak NaN
      price: 0,
      date: new Date(),
      notes: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/80 dark:text-foreground ">
          <Plus /> Record Transactions{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Record Transaction</DialogTitle>
            <DialogDescription>
              Record a new stock in or stock out transaction.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {/* Item */}
            <Field>
              <Label htmlFor="itemId">Item*</Label>
              <Controller
                control={control}
                name="itemId"
                rules={{
                  required: { value: true, message: "Item is required" },
                }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemData?.length > 0 &&
                        itemData?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} {`(${item.sku})`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                    {errors?.item?.message && (
                      <p className="leading-3 text-sm text-red-500">
                        {errors?.item?.message}
                      </p>
                    )}
                  </Select>
                )}
              />
            </Field>
            {/* Type of transaction */}
            <Field>
              <Label htmlFor="type">Type *</Label>
              <Controller
                control={control}
                name="type"
                rules={{
                  required: { value: true, message: "Type is required" },
                }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">In</SelectItem>
                      <SelectItem value="OUT">Out</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.type?.message && (
                <p className="leading-3 text-sm text-red-500">
                  {errors?.type?.message}
                </p>
              )}
            </Field>

            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="quantity">Quantity*</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  min={0}
                  {...register("quantity", {
                    required: "Quantity is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Min 1" },
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                />
                {errors?.quantity?.message && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors?.quantity?.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  min={0}
                  {...register("price", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                />
                {errors?.price?.message && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors?.price?.message}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <Label htmlFor="date">Date*</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </Field>

            {/* Note section */}
            <Field>
              <Label htmlFor="note">Note</Label>

              <InputGroup>
                <InputGroupTextarea
                  id="note"
                  placeholder="Optional notes for transaction..."
                  rows={4}
                  className="min-h-24 resize-none"
                  {...register("note", { required: false })}
                />
              </InputGroup>
            </Field>
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
