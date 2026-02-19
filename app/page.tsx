import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  } else {
    return redirect("/dashboard");
  }
};

export default page;
