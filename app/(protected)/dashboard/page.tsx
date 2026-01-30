import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return <h1>{session?.user?.name}</h1>;
};

export default page;
