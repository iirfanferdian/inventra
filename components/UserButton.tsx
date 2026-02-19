"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, SettingsIcon, User, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const UserButton = () => {
  const { data: session, status } = useSession();
  const userImage = session?.user?.image;
  const userName = session?.user?.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-3 px-2 py-6 hover:bg-accent transition-all rounded-full sm:rounded-md"
        >
          {/* Avatar Container */}
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-primary/10 border border-border">
            {userImage ? (
              <Image
                src={
                  userImage.includes("?")
                    ? userImage
                    : `${userImage}?t=${Date.now()}`
                }
                alt={userName || "User"}
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/80">
                <User size={20} className="text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-semibold leading-none">
              {status === "loading" ? "Loading..." : userName}
            </span>
            <span className="text-xs text-muted-foreground leading-none mt-1">
              Account
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
