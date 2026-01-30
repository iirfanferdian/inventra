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

const UserButton = ({ username }: { username?: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-2 flex items-center gap-2 hover:bg-primary/10 cursor-pointer p-1 rounded-md ">
          <div className="bg-primary/80 p-1.5 rounded-full">
            <User size={20} className="text-primary-foreground" />
          </div>
          <p className="font-sm">{username ? username : "Username"}</p>
        </button>
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
