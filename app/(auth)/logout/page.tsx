"use client";
import { signOut } from "next-auth/react";

const Page = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <button
        onClick={() => signOut({ redirectTo: "/login" })}
        className="text-primary-foreground bg-primary w-20 h-auto rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Page;
