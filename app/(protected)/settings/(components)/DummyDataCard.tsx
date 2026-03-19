"use client";

import { seedDummyData } from "@/app/actions/seed-dummy-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

const DummyDataCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDummyData = async () => {
    setIsLoading(true);
    try {
      const result = await seedDummyData();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        "Error: " +
          (error instanceof Error ? error.message : "Failed to add dummy data"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dummy Data</CardTitle>
        <CardDescription>
          Add fake data to know how this web app works
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to add the data that includes:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>8 product from any category (Electronics, Fashion, Food)</li>
            <li>Transaction IN/OUT within last 3 months</li>
            <li>Stocks data and history of transaction</li>
          </ul>
          <Button
            onClick={handleAddDummyData}
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary dark:text-foreground"
          >
            {isLoading ? "Adding data..." : "Add The Dummy Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DummyDataCard;
