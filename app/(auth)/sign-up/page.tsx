"use client";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import Input from "@/components/Input";

import { LoaderCircle, Lock, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

const SignInPage = () => {
  const [error, setError] = useState("");

  interface IForm {
    fullName: string;
    email: string;
    password: string;
    verifyPassword: string;
  }
  const methods = useForm<IForm>({ mode: "onBlur" }); // Objek utama untuk Provider
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const passwordValue = watch("password");
  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const { email, fullName, password } = data;

    try {
      const payload = { fullName, email, password };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      //Check if user already exists
      if (res.status === 409) {
        setError(
          "Email already exist, please sign in with your email or Google",
        );
      }

      //Sign in if user already created
      if (res.status === 201) {
        await signIn("credentials", {
          email,
          password,
          redirectTo: "/dashboard",
        });
      }
    } catch (error) {
      console.log("front end error:", error);
    }
  };
  return (
    <>
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center p-12">
        <div className="w-full flex flex-col justify-center items-center">
          <h1>Create an account</h1>
          <p>Get started with Inventra today</p>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form className="mt-6 w-70" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-4 justify-center items-center">
              {/* Fullname */}
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative w-full">
                  <User
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Nafri Bro"
                    type="text"
                    {...register("fullName", {
                      required: { value: true, message: "Name is required" },
                      minLength: {
                        value: 3,
                        message: "Min 3 characters length ",
                      },
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <div className="relative w-full">
                  <Mail
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="name@example.com"
                    type="text"
                    {...register("email", {
                      required: { value: true, message: "Email is required" },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Password</label>
                <div className="relative w-full">
                  <Lock
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                      minLength: {
                        value: 6,
                        message: "Password min 6 character",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative w-full">
                  <Lock
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...register("verifyPassword", {
                      validate: (value) =>
                        value === passwordValue || "Password doesn't match",
                    })}
                  />
                </div>
                {errors.verifyPassword && (
                  <p className="leading-3 text-sm text-red-500">
                    {errors.verifyPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Button Sign Up */}
            <div className="w-full flex flex-col mt-4 justify-center items-end">
              {error && (
                <p className="pb-4 w-full text-center leading-3 text-sm text-red-500">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex justify-center w-full ${isSubmitting ? "bg-primary/50" : "bg-primary/80"} p-2 rounded-md hover:bg-primary/60 text-primary-foreground text-sm font-medium`}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  "Sign Up"
                )}
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

          <GoogleAuthButton />
        </FormProvider>
        {/* Footer */}
        <div className="mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="login"
              className="text-primary/80 hover:underline hover:cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
