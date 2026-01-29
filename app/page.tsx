import { auth } from "@/auth";

const page = async () => {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }
  return <h1 className="">{JSON.stringify(session)}</h1>;
};

export default page;
