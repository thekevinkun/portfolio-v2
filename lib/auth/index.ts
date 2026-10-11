import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { authEnv } from "./env";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

// GitHub only, JWT sessions, no adapter and no auth tables (D82)
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt", maxAge: SEVEN_DAYS },
  // Rejected accounts come back to the login page with ?error=AccessDenied
  pages: { signIn: "/dashboard/login", error: "/dashboard/login" },
  callbacks: {
    // Allowlist: one numeric GitHub user id (D83)
    signIn({ account }) {
      return (
        account?.provider === "github" &&
        account.providerAccountId === authEnv.ADMIN_GITHUB_ID
      );
    },
    jwt({ token, account }) {
      // account is only present on sign-in
      if (account) token.sub = account.providerAccountId;
      return token;
    },
    session({ session, token }) {
      session.user.githubId = token.sub ?? "";
      return session;
    },
  },
});
