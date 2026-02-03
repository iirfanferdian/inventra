import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import React from "react";

const Security = () => {
  return (
    <section className="w-full flex flex-col gap-8 bg-background rounded-lg hover:shadow-lg transition-shadow my-8 p-6">
      <div className=" flex-col items-center justify-center h-auto  ">
        <div className="flex items-center gap-2">
          <Shield />
          <h2 className="text-md border-b-0 pb-0">Security Actions</h2>
        </div>
        <p border-b-0 className="text-sm text-muted-foreground">
          Manage your account security and authentication.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-muted-foreground/10 p-4 rounded-lg">
          <div className="flex flex-col justify-center">
            <h2 className="border-b-0 pb-0 text-sm">Change Password</h2>
            <p className="text-muted-foreground text-sm">
              Ensure your account uses a strong, unique password.
            </p>
          </div>
          <Button className="bg-muted-foregroud/10 border border-foreground text-foreground hover:bg-muted-foreground/10">
            Update
          </Button>
        </div>
        <div className="flex justify-between items-center bg-muted-foreground/10 p-4 rounded-lg">
          <div className="flex flex-col justify-center">
            <h2 className="border-b-0 pb-0 text-sm">Change Password</h2>
            <p className="text-muted-foreground text-sm">
              Ensure your account uses a strong, unique password.
            </p>
          </div>
          <Button className="bg-muted-foregroud/10 border border-foreground text-foreground hover:bg-muted-foreground/10">
            Update
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Security;
