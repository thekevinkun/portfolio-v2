import { signOut } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function DashboardHome() {
  const session = await requireAdmin();

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/dashboard/login" });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-fg-high">Dashboard</h1>
        <p className="text-sm text-fg-low">
          Signed in as {session.user.name ?? "admin"}.
        </p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
