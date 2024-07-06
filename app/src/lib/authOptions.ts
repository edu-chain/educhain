// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import { Session, Account } from "next-auth";


interface Token extends JWT {
  accessToken?: string;
  // Other custom fields you might add
}

interface ExtendedSession extends Session {
  accessToken?: string;
}



export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "repo user",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: Token; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: Token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };





