import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      async authorize(credentials) {
        console.log(credentials);
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        try {
          //Validation form
          if (!email || !password) {
            return null;
          }

          //Find user
          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            return null;
          }

          //Check password is valid
          const passwordValid = await compare(password, user.password);

          if (!passwordValid) {
            return null;
          }

          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/login", signOut: "/logout", error: "/error" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
