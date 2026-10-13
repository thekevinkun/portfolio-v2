import type { Metadata } from "next";
import FormSection from "@/components/dashboard/FormSection";
import ProjectRow from "@/components/dashboard/ProjectRow";
import { ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminProjects } from "@/lib/db/admin-queries";
import { PROJECT_FILTERS } from "@/lib/projects/filters";
import { MAX_FEATURED_PROJECTS } from "@/types/limits";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  await requireAdmin();
  const projects = await getAdminProjects();
  const featuredVisible = projects.filter(
    (project) => project.featured && project.visible,
  ).length;

  // Same pill order and labels as the public Projects page; empty groups are skipped
  const groups = PROJECT_FILTERS.map(({ id, label }) => ({
    id,
    label,
    items: projects.filter((project) => project.filter === id),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8 lg:px-10 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg-high">
            Projects
          </h1>
          <p className="mt-1 max-w-xl text-sm text-fg-low">
            Overview shows the first {MAX_FEATURED_PROJECTS} featured, visible
            projects ({featuredVisible} of {MAX_FEATURED_PROJECTS} now). Moving
            a project only reorders it within its filter.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/dashboard/projects/new" size="sm">
            New project
          </ButtonLink>
          <ButtonLink
            href="/projects"
            variant="secondary"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            View site ↗
          </ButtonLink>
        </div>
      </header>

      {groups.length === 0 ? (
        <p className="text-sm text-fg-low">
          No projects yet. Use New project to add the first one.
        </p>
      ) : (
        groups.map((group) => (
          <FormSection
            key={group.id}
            title={group.label}
            description={`${group.items.length} ${group.items.length === 1 ? "project" : "projects"}`}
          >
            <ul className="divide-y divide-glass-border">
              {group.items.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isFirst={index === 0}
                  isLast={index === group.items.length - 1}
                />
              ))}
            </ul>
          </FormSection>
        ))
      )}
    </div>
  );
}
