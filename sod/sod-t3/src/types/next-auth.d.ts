import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
