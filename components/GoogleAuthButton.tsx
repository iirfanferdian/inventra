import { LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

const GoogleAuthButton = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <div className="relative w-70">
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
        width={20}
        height={20}
        alt="Google Logo"
        className="absolute top-1/2 -translate-y-1/2 left-3"
      />
      <button
        onClick={async () =>
          await signIn("google", { redirectTo: "/dashboard" })
        }
        type="button"
        disabled={isSubmitting}
        className={`w-full ${isSubmitting ? "bg-gray-300" : "bg-background"} flex justify-center p-2 shadow-md rounded-md hover:bg-foreground/2 text-foreground text-sm font-medium`}
      >
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" size={20} />
        ) : (
          "Sign in with Google"
        )}
      </button>
    </div>
  );
};

export default GoogleAuthButton;
