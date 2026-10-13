import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/dashboard/ProjectForm";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  getAdminCategories,
  getAdminProjectBySlug,
} from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const [project, categories] = await Promise.all([
    getAdminProjectBySlug(slug),
    getAdminCategories(),
  ]);
  if (!project) notFound();

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
          {project.title}
        </h1>
      </header>
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
