"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, SettingsIcon, User, UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

const UserButton = ({ username }: { username?: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-muted-primary p-2 py-5 flex items-center gap-2 hover:bg-muted-foreground/10 cursor-pointer rounded-md text-foreground">
          <div className="bg-primary/80 p-1.5 rounded-full">
            <User
              size={20}
              className="dark:text-foreground text-primary-foreground"
            />
          </div>
          <span className="font-sm">Username</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <Link href={"/settings"}>
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut({ callbackUrl: "/login" });
          }}
          variant="destructive"
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
