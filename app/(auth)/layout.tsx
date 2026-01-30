import { auth } from "@/auth";
import { Box, ChartColumn, Shield, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <aside className="hidden md:flex flex-col bg-primary justify-center items-start p-12">
        <div className="flex gap-2">
          <Box size={40} className="text-primary-foreground" />
          <h1 className="text-primary-foreground">Inventra</h1>
        </div>
        <div className=" mt-6">
          <h1 className="text-primary-foreground">
            Manage Your Inventory & Finance with Ease
          </h1>
          <p className="text-secondary pt-2">
            Streamline your business operations with our powerful inventory and
            financial management platform.
          </p>
        </div>
        <ul className="text-primary-foreground flex flex-col mt-8 items-start gap-6">
          {/* Real-time Analytics */}
          <li className="list-none flex justify-center items-center gap-3">
            <div className="bg-muted-foreground/40 p-2 rounded-xl">
              <ChartColumn size={30} />
            </div>
            <div className="flex flex-col">
              <h4>Real-time Analytics</h4>
              <p className="m-0 opacity-90">
                Track your business performance with live dashboards
              </p>
            </div>
          </li>

          {/* Team Collaboration*/}
          <li className="list-none flex justify-center items-center gap-3">
            <div className="bg-muted-foreground/40 p-2 rounded-xl">
              <Users size={30} />
            </div>
            <div className="flex flex-col">
              <h4>Team Collaboration</h4>
              <p className="m-0 opacity-90">
                Work together with role-based access controls
              </p>
            </div>
          </li>

          {/* Secure & Reliable */}
          <li className="list-none flex justify-center items-center gap-3">
            <div className="bg-muted-foreground/40 p-2 rounded-xl">
              <Shield size={30} />
            </div>
            <div className="flex flex-col">
              <h4>Secure & Reliable</h4>
              <p className="m-0 opacity-90">
                Enterprise-grade security for your data
              </p>
            </div>
          </li>
        </ul>
      </aside>
      <main>{children}</main>
    </div>
  );
}
