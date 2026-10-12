import type { ReactNode } from "react";
import { DashboardNav, SignOutForm } from "./";

interface DashboardShellProps {
  userName: string;
  children: ReactNode;
}

// One <aside>: a sticky top bar on phones, a fixed sidebar from lg (D95).
// The page itself scrolls normally; R1 and R2 don't apply here.
const DashboardShell = ({ userName, children }: DashboardShellProps) => {
  return (
    <div className="min-h-dvh bg-obsidian text-fg-high">
      <aside className="sticky top-0 z-20 border-b border-glass-border bg-obsidian lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-3 lg:px-5 lg:pt-6">
          <span className="font-mono text-xs font-bold tracking-widest text-fg-high uppercase">
            Dashboard
          </span>
          <div className="lg:hidden">
            <SignOutForm />
          </div>
        </div>
        <DashboardNav />
        <div className="hidden space-y-3 border-t border-glass-border p-5 lg:mt-auto lg:block">
          <p className="truncate text-xs text-fg-low">{userName}</p>
          <SignOutForm />
        </div>
      </aside>
      <main className="lg:pl-64">{children}</main>
    </div>
  );
};

export default DashboardShell;
