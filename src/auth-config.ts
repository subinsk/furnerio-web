import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib";
import { API_URL } from "./config";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnHome = !nextUrl.pathname.startsWith("/auth");
      if (isOnHome) {
        if (!isLoggedIn)
          return NextResponse.redirect(new URL("/auth/login", nextUrl));
        return NextResponse.next();
      } else if (isLoggedIn)
        return NextResponse.redirect(new URL("/", nextUrl));

      return NextResponse.next();
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }).then((res) => res.json());

          console.log(response);

          return {
            id: response.id,
            email: response.email,
            name: response.name,
          };
        }

        return null;
      },
    }),
    GoogleProvider,
    GithubProvider,
  ],
} satisfies NextAuthConfig;
