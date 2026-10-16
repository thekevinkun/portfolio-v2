"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog, Switch } from "@/components/dashboard/ui";
import { Button, ButtonLink, Pill } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  deleteProject,
  moveProject,
  setProjectFeatured,
  setProjectVisible,
} from "@/lib/dashboard/actions/projects";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { ActionResult } from "@/types/action";
import type { AdminProject } from "@/types/admin";

interface ProjectRowProps {
  project: AdminProject;
  isFirst: boolean;
  isLast: boolean;
}

const ProjectRow = ({ project, isFirst, isLast }: ProjectRowProps) => {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const isLive = project.status === "live";

  // Runs one action: a failure shows as a toast, a success refreshes the list
  const run = (action: () => Promise<ActionResult>, success?: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (success) toast.success(success);
    });
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const result = await deleteProject({ id: project.id });
      if (result.ok) toast.success(`${project.title} deleted`);
      else toast.error(result.error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3 py-4",
        !project.visible && "opacity-70",
      )}
    >
      <div className="min-w-0 flex-1 basis-56">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-fg-high">{project.title}</h3>
          <Pill
            variant={isLive ? "solid" : "glass"}
            dot={isLive ? "static" : undefined}
            className="px-2 py-0.5 font-mono text-[10px] uppercase"
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </Pill>
          {!project.visible ? (
            <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
              Hidden
            </Pill>
          ) : null}
          {project.details !== null ? (
            <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
              Has details
            </Pill>
          ) : null}
        </div>
        <p className="mt-1 truncate font-mono text-xs text-fg-low">
          {project.kicker}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Switch
          label="Visible"
          checked={project.visible}
          disabled={pending}
          onChange={() =>
            run(
              () =>
                setProjectVisible({
                  id: project.id,
                  visible: !project.visible,
                }),
              project.visible
                ? `${project.title} is hidden`
                : `${project.title} is visible`,
            )
          }
        />
        <Switch
          label="Featured"
          checked={project.featured}
          disabled={pending}
          onChange={() =>
            run(
              () =>
                setProjectFeatured({
                  id: project.id,
                  featured: !project.featured,
                }),
              project.featured
                ? `${project.title} is no longer featured`
                : `${project.title} is featured`,
            )
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <ButtonLink
          href={`/dashboard/projects/${project.slug}`}
          variant="secondary"
          size="sm"
          aria-label={`Edit ${project.title}`}
        >
          Edit
        </ButtonLink>
        <ButtonLink
          href={`/dashboard/projects/${project.slug}/details`}
          variant="secondary"
          size="sm"
          aria-label={`Edit details of ${project.title}`}
        >
          Details
        </ButtonLink>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Move ${project.title} up`}
          disabled={isFirst || pending}
          className="disabled:opacity-40"
          onClick={() =>
            run(() => moveProject({ id: project.id, direction: "up" }))
          }
        >
          ↑
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Move ${project.title} down`}
          disabled={isLast || pending}
          className="disabled:opacity-40"
          onClick={() =>
            run(() => moveProject({ id: project.id, direction: "down" }))
          }
        >
          ↓
        </Button>
        <ConfirmDialog
          triggerLabel="Delete"
          title={`Delete ${project.title}?`}
          description={
            <>
              This permanently deletes the project and cannot be undone. To
              remove it from the public site but keep its data, turn off Visible
              instead.
            </>
          }
          pending={deleting}
          onConfirm={remove}
        />
      </div>
    </li>
  );
};

export default ProjectRow;
