import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button, GlassCard } from "@/components/ui";
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
    <main className="flex min-h-dvh items-center justify-center bg-obsidian px-6">
      <GlassCard
        spotlight={false}
        className="w-full max-w-sm space-y-6 p-8 text-center"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-fg-high">
            Dashboard
          </h1>
          <p className="text-sm text-fg-low">
            Sign in with the admin GitHub account.
          </p>
        </div>
        {message ? (
          <p role="alert" className="text-sm text-danger">
            {message}
          </p>
        ) : null}
        <form action={signInWithGitHub}>
          <Button type="submit" className="w-full">
            Continue with GitHub
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
