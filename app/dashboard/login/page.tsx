import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { getAdminSession } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Dashboard sign in" };

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Already signed in as the admin: skip the form
  if (await getAdminSession()) redirect("/dashboard");

  const { error } = await searchParams;
  const message =
    error === "AccessDenied"
      ? "This GitHub account is not allowed."
      : error
        ? "Sign-in failed. Please try again."
        : null;

  async function signInWithGitHub() {
    "use server";
    await signIn("github", { redirectTo: "/dashboard" });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-fg-high">Dashboard</h1>
        <p className="text-sm text-fg-low">
          Sign in with the admin GitHub account.
        </p>
        {message ? (
          <p role="alert" className="text-sm text-fg-high">
            {message}
          </p>
        ) : null}
        <form action={signInWithGitHub}>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Continue with GitHub
          </button>
        </form>
      </div>
    </main>
  );
}
