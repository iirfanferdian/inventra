import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Menambahkan 'currency' ke dalam objek session.user
   */
  interface Session {
    user: {
      id: string;
      currency: string;
    } & DefaultSession["user"];
  }

  /**
   * Menambahkan 'currency' ke dalam objek user saat pertama kali login (authorize)
   */
  interface User {
    currency?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Menambahkan 'currency' ke dalam token JWT
   */
  interface JWT {
    id: string;
    currency: string;
  }
}
