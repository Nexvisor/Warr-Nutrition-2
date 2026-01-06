import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const Next_Auth: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        user: { label: "User", type: "text" },
      },
      async authorize(credentials: any) {
        let { user } = credentials;
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
    maxAge: 30 * 24 * 60 * 60, // ✅ 30 day session expiry (in seconds)
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // ✅ 30 day JWT expiry (in seconds)
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
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
