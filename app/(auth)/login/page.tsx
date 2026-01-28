"use client";
import Input from "@/components/Input";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

const LoginPage = () => {
  interface IForm {
    email: string;
    password: string;
  }

  const { register, handleSubmit } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = (data) => {
    console.log(data);
  };
  return (
    <>
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center p-12">
        <div className="w-full flex flex-col justify-center items-center">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form className="mt-6 w-70" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            {/* Email */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">Email</label>
              <div className="relative w-full">
                <Mail
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input placeholder="name@example.com" type="text" />
              </div>
            </div>

            {/* Password */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">Password</label>
              <div className="relative w-full">
                <Lock
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input placeholder="Enter your password" type="password" />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col mt-4 justify-center items-end">
            <label className="mb-4 text-sm font-medium text-primary/80 hover:underline">
              Forgot Password?
            </label>
            <button className="w-full bg-primary/80 p-2 rounded-md hover:bg-primary/60 text-primary-foreground text-sm font-medium ">
              Sign In
            </button>
          </div>
        </form>

        {/* Seperator */}
        <div className="relative w-1/2 my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="border-t w-full border-muted-foreground"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>
        {/* Login with google :)) */}
        <div className="relative w-70">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            width="20px"
            alt="Google Logo"
            className="absolute top-1/2 -translate-y-1/2 left-3"
          />
          <button className="w-full bg-background p-2 shadow-md rounded-md hover:bg-foreground/2 text-foreground text-sm font-medium ">
            Sign in with Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4">
          <p className="text-sm">
            Dont have an acount?{" "}
            <Link
              href="sign-up"
              className="text-primary/80 hover:underline hover:cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
