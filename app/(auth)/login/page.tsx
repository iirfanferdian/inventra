"use client";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import Input from "@/components/Input";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

const LoginPage = () => {
  const [error, setError] = useState("");

  const router = useRouter();
  interface IForm {
    email: string;
    password: string;
  }

  const methods = useForm<IForm>({ mode: "onBlur" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    const { email, password } = data;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email or password is invalid");
    } else {
      router.push("/dashboard");
    }
  };
  return (
    <>
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center p-12">
        <div className="w-full flex flex-col justify-center items-center">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
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
            </div>
            {/* Button Sign Up */}
            <div className="w-full flex flex-col mt-4 justify-center items-end">
              <label className="mb-4 text-sm font-medium text-primary/80 hover:underline">
                Forgot Password?
              </label>
              {error && (
                <p className="pb-4 w-full text-center leading-3 text-sm text-red-500">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex justify-center w-full ${isSubmitting ? "bg-primary/50" : "bg-primary/80"} p-2 rounded-md hover:bg-primary/60 text-primary-foreground text-sm font-medium `}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  "Sign In"
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
