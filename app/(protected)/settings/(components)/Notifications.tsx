import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import React from "react";

const Notifications = () => {
  return (
    <section className="w-full flex flex-col gap-8 bg-background rounded-lg hover:shadow-lg transition-shadow my-8 p-6">
      <div className="flex flex-col ">
        <div className="flex items-center gap-2">
          <Bell />
          <h2 className="text-md border-b-0 pb-0">Notifications Preferences</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          {" "}
          Choose what notifications you want to receive
        </p>
      </div>
      <div>
        {/* Selection */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm border-b-0 pb-0"> Low Stock Alerts</h2>
              <p className="text-muted-foreground">
                Get notified when items drop below safety threshold.
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm border-b-0 pb-0"> Weekly Reports</h2>
              <p className="text-muted-foreground">
                Receive a summary of your weekly activity.
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm border-b-0 pb-0"> Product Updates</h2>
              <p className="text-muted-foreground">
                Stay informed about new features and improvements.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
