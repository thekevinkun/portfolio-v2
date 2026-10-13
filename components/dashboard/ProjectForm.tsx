"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui";
import { discardAsset, uploadAsset } from "@/lib/dashboard/actions/assets";
import { createProject, updateProject } from "@/lib/dashboard/actions/projects";
import {
  joinLines,
  oneOf,
  readLines,
  readText,
} from "@/lib/dashboard/form-data";
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { revokePending } from "@/lib/dashboard/pending-asset";
import { slugify } from "@/lib/dashboard/slugify";
import { PROJECT_FILTERS, PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { AdminProject } from "@/types/admin";
import type { AssetChange } from "@/types/assets";
import {
  PROJECT_LINK_KINDS,
  PROJECT_STATUSES,
  type ProjectLink,
  type ProjectLinkKind,
} from "@/types/projects";
import AssetField from "./AssetField";
import FormSection from "./FormSection";
import TextField from "./TextField";
import { FieldRow, Select } from "./ui";

const LINK_TITLES: Record<ProjectLinkKind, string> = {
  live: "Live demo",
  repo: "Repository",
};

const LINK_DEFAULT_LABELS: Record<ProjectLinkKind, string> = {
  live: "Live Demo",
  repo: "Repo",
};

const FILTER_IDS = PROJECT_FILTERS.map((filter) => filter.id);

// aria-describedby for a select that has a hint and maybe an error
const describedBy = (name: string, hasError: boolean) =>
  hasError ? `${name}-hint ${name}-error` : `${name}-hint`;

// Edit mode when a project is given, create mode otherwise
const ProjectForm = ({ project }: { project?: AdminProject }) => {
  const router = useRouter();
  const editing = project !== undefined;
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedLogo, setSavedLogo] = useState<string | null>(
    project?.logoUrl ?? null,
  );
  // A picked logo stays in the browser until Save (D101)
  const [logoChange, setLogoChange] = useState<AssetChange>(undefined);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => readText(data, name);

    const title = text("title");
    // The slug of an existing project never changes
    const slug = project ? project.slug : text("slug") || slugify(title);

    // An empty URL hides the button; the kinds are kept to map errors back
    const links: ProjectLink[] = [];
    for (const kind of PROJECT_LINK_KINDS) {
      const url = text(`link.${kind}.url`);
      if (url) links.push({ kind, label: text(`link.${kind}.label`), url });
    }
    const linkKinds = links.map((link) => link.kind);

    const fields = {
      slug,
      title,
      kicker: text("kicker"),
      summary: text("summary"),
      filter: oneOf(
        FILTER_IDS,
        text("filter"),
        project?.filter ?? "full-stack",
      ),
      status: oneOf(
        PROJECT_STATUSES,
        text("status"),
        project?.status ?? "in-progress",
      ),
      tech: readLines(data, "tech"),
      links,
    };

    // Server paths ("links.1.url", "tech.2") to the control that shows them
    const rename = (key: string): string => {
      const link = /^links\.(\d+)\.(url|label|kind)$/.exec(key);
      if (link) {
        const kind = linkKinds[Number(link[1])];
        const field = link[2] === "label" ? "label" : "url";
        return kind ? `link.${kind}.${field}` : "links";
      }
      if (/^tech\.\d+$/.test(key)) return "tech";
      return key === "logoUrl" ? "logo" : key;
    };

    startTransition(async () => {
      let uploaded: string | null = null;
      let step = "save the project";

      try {
        // 1. Upload the logo only if it changed (D101)
        let logoUrl = savedLogo;
        if (logoChange === null) {
          logoUrl = null;
        } else if (logoChange) {
          step = "upload the logo";
          const body = new FormData();
          body.set("kind", "logo");
          body.set("file", logoChange.file);
          const upload = await uploadAsset(body);
          if (!upload.ok) {
            toast.error(`Logo: ${upload.error}`);
            return;
          }
          uploaded = upload.data.url;
          logoUrl = uploaded;
          step = "save the project";
        }

        // 2. Save the project with the final logo URL
        const content = { ...fields, logoUrl };
        const result = editing
          ? await updateProject(content)
          : await createProject(content);

        if (!result.ok) {
          // The database was not changed, so the new file must not stay
          if (uploaded) await discardAsset({ url: uploaded }).catch(() => {});
          setErrors(toFormErrors(result.fieldErrors, rename));
          toast.error(result.error);
          return;
        }

        revokePending(logoChange);
        if (!editing) {
          toast.success(`${title} created`);
          router.push("/dashboard/projects");
          return;
        }

        setErrors({});
        setLogoChange(undefined);
        setSavedLogo(logoUrl);
        // updateProject also reports whether the old logo could be deleted
        if (result.data?.cleanupFailed) {
          toast.warning("Saved, but the old logo could not be deleted.");
        } else {
          toast.success("Project saved");
        }
      } catch (error) {
        console.error(`Could not ${step}:`, error);
        if (uploaded) await discardAsset({ url: uploaded }).catch(() => {});
        toast.error(`Could not ${step}. Check your connection and try again.`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection title="Basics">
        <TextField
          name="title"
          label="Title"
          defaultValue={project?.title ?? ""}
          error={errors.title}
        />
        <TextField
          name="slug"
          label="Slug"
          defaultValue={project?.slug ?? ""}
          readOnly={editing}
          hint={
            editing
              ? "The slug identifies this project and cannot be changed."
              : "Lowercase letters, digits and dashes. Leave empty to generate it from the title."
          }
          error={errors.slug}
        />
        <TextField
          name="kicker"
          label="Kicker"
          defaultValue={project?.kicker ?? ""}
          hint="The small label above the title, shown in capitals."
          error={errors.kicker}
        />
        <TextField
          name="summary"
          label="Summary"
          rows={4}
          defaultValue={project?.summary ?? ""}
          hint="Overview shows the first two lines; the Projects page shows all of it."
          error={errors.summary}
        />
      </FormSection>

      <FormSection title="Classification">
        <FieldRow
          label="Filter"
          htmlFor="filter"
          hint="Which tab on the Projects page shows it."
          error={errors.filter}
        >
          <Select
            id="filter"
            name="filter"
            defaultValue={project?.filter ?? "full-stack"}
            aria-invalid={errors.filter ? true : undefined}
            aria-describedby={describedBy("filter", Boolean(errors.filter))}
          >
            {PROJECT_FILTERS.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </Select>
        </FieldRow>
        <FieldRow
          label="Status"
          htmlFor="status"
          hint="Live needs a live demo link below."
          error={errors.status}
        >
          <Select
            id="status"
            name="status"
            defaultValue={project?.status ?? "in-progress"}
            aria-invalid={errors.status ? true : undefined}
            aria-describedby={describedBy("status", Boolean(errors.status))}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </FieldRow>
      </FormSection>

      <FormSection title="Technologies">
        <TextField
          name="tech"
          label="Tech tags"
          rows={5}
          defaultValue={joinLines(project?.tech ?? [])}
          hint="One per line, in the order they appear on the card. At least one."
          error={errors.tech}
        />
      </FormSection>

      <FormSection
        title="Links"
        description="Leave a URL empty to hide that button."
      >
        {PROJECT_LINK_KINDS.map((kind) => {
          const link = project?.links.find((item) => item.kind === kind);
          return (
            <div key={kind} className="grid gap-4 sm:grid-cols-[1fr_2fr]">
              <TextField
                name={`link.${kind}.label`}
                label={`${LINK_TITLES[kind]} label`}
                defaultValue={link?.label ?? LINK_DEFAULT_LABELS[kind]}
                error={errors[`link.${kind}.label`]}
              />
              <TextField
                name={`link.${kind}.url`}
                label={`${LINK_TITLES[kind]} URL`}
                defaultValue={link?.url ?? ""}
                error={errors[`link.${kind}.url`]}
              />
            </div>
          );
        })}
        {errors.links ? (
          <p role="alert" className="text-xs text-danger">
            {errors.links}
          </p>
        ) : null}
      </FormSection>

      <FormSection
        title="Logo"
        description="Shown beside the title on the cards. Without one, the first letter of the title is used."
      >
        <AssetField
          kind="logo"
          label="Logo"
          savedUrl={savedLogo}
          change={logoChange}
          disabled={pending}
          onChange={(change) => setLogoChange(change)}
        />
      </FormSection>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-glass-border bg-obsidian px-6 py-3 lg:-mx-10 lg:px-10">
        <ButtonLink href="/dashboard/projects" variant="secondary">
          Back to list
        </ButtonLink>
        <Button
          type="submit"
          disabled={pending}
          className="disabled:opacity-50"
        >
          {pending ? "Saving…" : editing ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
