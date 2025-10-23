import CredentialsProvider from "next-auth/providers/credentials";

import { NextAuthOptions } from "next-auth";
export const Next_Auth: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        user: { label: "User", type: "text" },
      },
      async authorize(credentails: any) {
        let { user } = credentails;
        user = JSON.parse(user);

        if (!user) {
          throw new Error("Email and password are required");
        }

        return {
          id: user?.id,
          email: user?.email,
          role: user?.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 🕐 1 hour session expiry (in seconds)
  },
  jwt: {
    maxAge: 60 * 60, // 🕐 1 hour session expiry (in seconds)
  },
  callbacks: {
    jwt: ({ token, user }) => {
      // Persist user data to the token right after sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      // Send user properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
