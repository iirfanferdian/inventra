import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return <h1 className="">{JSON.stringify(session)}</h1>;
};

export default page;
