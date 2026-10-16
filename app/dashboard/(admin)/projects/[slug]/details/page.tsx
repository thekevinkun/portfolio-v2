import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DetailsForm from "@/components/dashboard/DetailsForm";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminProjectBySlug } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Project details" };

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const project = await getAdminProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
      <header className="mb-8">
        <Link
          href={`/dashboard/projects/${project.slug}`}
          className="text-xs text-fg-low hover:text-fg-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← {project.title}
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg-high">
          Project details
        </h1>
        <p className="mt-1 max-w-xl text-sm text-fg-low">
          The write-up shown when a visitor opens {project.title}. Leave a
          section empty to hide it. Every claim must survive an interview
          question. Nothing shows on the public site yet.
        </p>
      </header>
      <DetailsForm project={project} />
    </div>
  );
}
