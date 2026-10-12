import type { ReactNode } from "react";
import { Toaster } from "@/components/dashboard/ui";
import { DashboardShell } from "@/components/dashboard";
import { requireAdmin } from "@/lib/auth/require-admin";

// A layout check alone doesn't cover server actions or later navigations, so
// every page and action calls requireAdmin() too (D84)
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <>
      <DashboardShell userName={session.user.name ?? "Admin"}>
        {children}
      </DashboardShell>
      <Toaster />
    </>
  );
}
