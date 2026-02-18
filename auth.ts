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

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            currency: user.currency,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session?.user) {
        // Pastikan nama propertinya sama!
        if (session.user.name) token.name = session.user.name;
        if (session.user.bio) token.bio = session.user.bio;
      }

      // If 'user' exists, it means this is the initial login moment
      if (user) {
        token.id = user.id as string; // We save the DB id into the encrypted token
        token.currency = user.currency as string;

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { id: true, currency: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.currency = dbUser.currency;
        }
      }

      return token; // The token is now saved in the user's browser cookie
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.currency = token.currency as string;
        session.user.bio = token.bio as string;
      }
      return session;
    },
  },
  pages: { signIn: "/login", signOut: "/logout", error: "/error" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
