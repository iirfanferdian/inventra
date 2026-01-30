"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, 3000);
  });
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <h1 className="text-muted-foreground">
        Oops something went wrong :(, redirecting...
      </h1>
    </div>
  );
};

export default Page;
