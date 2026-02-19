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
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        try {
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email: email },
          });

          if (!user || !user.password) return null;

          const passwordValid = await compare(password, user.password);
          if (!passwordValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            currency: user.currency,
            image: user.image, // Pastikan image dikembalikan saat login
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
      // 1. LOGIKA SAAT UPDATE (Triggered by update() from client)
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.bio) token.bio = session.user.bio;
        if (session.user.image) token.picture = session.user.image; // TAMBAHKAN INI (NextAuth pakai 'picture' di token default)
        if (session.user.currency) token.currency = session.user.currency;
      }

      // 2. LOGIKA SAAT INITIAL LOGIN
      if (user) {
        token.id = user.id as string;
        token.currency = user.currency as string;
        token.picture = user.image as string; // TAMBAHKAN INI

        // Opsional: Jika butuh data terbaru dari DB saat login
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { id: true, currency: true, image: true, bio: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.currency = dbUser.currency;
          token.picture = dbUser.image; // TAMBAHKAN INI
          token.bio = dbUser.bio;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.currency = token.currency as string;
        session.user.bio = token.bio as string;
        session.user.image = token.picture as string; // TAMBAHKAN INI (Mapping dari token.picture ke session.user.image)
      }
      return session;
    },
  },
  pages: { signIn: "/login", signOut: "/logout", error: "/error" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
