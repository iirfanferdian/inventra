import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
