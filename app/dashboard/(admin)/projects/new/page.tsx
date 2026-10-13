import type { Metadata } from "next";
import Link from "next/link";
import ProjectForm from "@/components/dashboard/ProjectForm";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
      <header className="mb-8">
        <Link
          href="/dashboard/projects"
          className="text-xs text-fg-low hover:text-fg-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Projects
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg-high">
          New project
        </h1>
        <p className="mt-1 text-sm text-fg-low">
          It starts visible, not featured, and last in order. Change that in the
          list.
        </p>
      </header>
      <ProjectForm />
    </div>
  );
}
