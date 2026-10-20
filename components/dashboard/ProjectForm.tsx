"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui";
import AssetField from "./AssetField";
import FormSection from "./FormSection";
import TextField from "./TextField";
import { FieldRow, Select } from "./ui";
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
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { AdminCategory, AdminProject } from "@/types/admin";
import {
  PROJECT_ASSET_KINDS,
  type AssetChange,
  type ProjectAssetKind,
} from "@/types/assets";
import { MAX_CARD_TECH } from "@/types/limits";
import {
  PROJECT_LINK_KINDS,
  PROJECT_STATUSES,
  type ProjectLink,
  type ProjectLinkKind,
} from "@/types/projects";

const LINK_TITLES: Record<ProjectLinkKind, string> = {
  live: "Live demo",
  repo: "Repository",
};

const LINK_DEFAULT_LABELS: Record<ProjectLinkKind, string> = {
  live: "Live Demo",
  repo: "Repo",
};

const IMAGE_LABELS: Record<ProjectAssetKind, string> = {
  icon: "Icon",
  logo: "Logo",
};

// aria-describedby for a select that has a hint and maybe an error
const describedBy = (name: string, hasError: boolean) =>
  hasError ? `${name}-hint ${name}-error` : `${name}-hint`;

// Deletes files uploaded during a save that then failed. The server refuses
// to delete anything a saved row uses, so this is safe.
async function rollbackUploads(urls: string[]) {
  await Promise.all(urls.map((url) => discardAsset({ url }).catch(() => {})));
}

// Edit mode when a project is given, create mode otherwise
const ProjectForm = ({
  project,
  categories,
}: {
  project?: AdminProject;
  categories: AdminCategory[];
}) => {
  const router = useRouter();
  const editing = project !== undefined;
  const categoryIds = categories.map((category) => category.slug);
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // What the database holds for each image
  const [saved, setSaved] = useState<Record<ProjectAssetKind, string | null>>({
    icon: project?.iconUrl ?? null,
    logo: project?.logoUrl ?? null,
  });
  // Picked images stay in the browser until Save (D101)
  const [changes, setChanges] = useState<
    Partial<Record<ProjectAssetKind, AssetChange>>
  >({});

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
        categoryIds,
        text("filter"),
        project?.filter ?? categoryIds[0] ?? "",
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
      return /^tech\.\d+$/.test(key) ? "tech" : key;
    };

    startTransition(async () => {
      const urls: Record<ProjectAssetKind, string | null> = { ...saved };
      const uploaded: string[] = [];
      let step = "save the project";

      try {
        // 1. Upload only the images that changed, one request each (D101)
        for (const kind of PROJECT_ASSET_KINDS) {
          const change = changes[kind];
          if (change === undefined) continue;
          if (change === null) {
            urls[kind] = null;
            continue;
          }

          step = `upload the ${kind}`;
          const body = new FormData();
          body.set("kind", kind);
          body.set("file", change.file);
          const upload = await uploadAsset(body);

          if (!upload.ok) {
            await rollbackUploads(uploaded);
            toast.error(`${IMAGE_LABELS[kind]}: ${upload.error}`);
            return;
          }
          uploaded.push(upload.data.url);
          urls[kind] = upload.data.url;
        }

        // 2. Save the project with the final image URLs
        step = "save the project";
        const content = { ...fields, iconUrl: urls.icon, logoUrl: urls.logo };
        const result = editing
          ? await updateProject(content)
          : await createProject(content);

        if (!result.ok) {
          // The database was not changed, so the new files must not stay
          await rollbackUploads(uploaded);
          setErrors(toFormErrors(result.fieldErrors, rename));
          toast.error(result.error);
          return;
        }

        for (const kind of PROJECT_ASSET_KINDS) revokePending(changes[kind]);
        if (!editing) {
          toast.success(`${title} created`);
          router.push("/dashboard/projects");
          return;
        }

        setErrors({});
        setChanges({});
        setSaved(urls);
        // updateProject also reports whether an old image could be deleted
        if (result.data?.cleanupFailed) {
          toast.warning("Saved, but an old image could not be deleted.");
        } else {
          toast.success("Project saved");
        }
      } catch (error) {
        console.error(`Could not ${step}:`, error);
        await rollbackUploads(uploaded);
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
          hint={
            <>
              Which tab on the Projects page shows it.{" "}
              <Link
                href="/dashboard/categories"
                className="underline hover:text-fg-high"
              >
                Manage categories
              </Link>
            </>
          }
          error={errors.filter}
        >
          <Select
            id="filter"
            name="filter"
            defaultValue={project?.filter ?? categoryIds[0]}
            aria-invalid={errors.filter ? true : undefined}
            aria-describedby={describedBy("filter", Boolean(errors.filter))}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
                {category.visible ? "" : " (hidden)"}
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
          rows={6}
          defaultValue={joinLines(project?.tech ?? [])}
          hint={`One per line, at least one, as many as you like. Put the most important first: the cards show the first ${MAX_CARD_TECH} and a "+N" chip for the rest.`}
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
        title="Images"
        description="The icon is the small square on the cards; without one, the first letter of the title is used. The logo is the wide image (icon and name) shown at the top right of the project details, straight on the dark page with no box: use a transparent PNG or WebP with light colors."
      >
        {PROJECT_ASSET_KINDS.map((kind) => (
          <AssetField
            key={kind}
            kind={kind}
            label={IMAGE_LABELS[kind]}
            savedUrl={saved[kind]}
            change={changes[kind]}
            disabled={pending}
            onChange={(change) =>
              setChanges((previous) => ({ ...previous, [kind]: change }))
            }
          />
        ))}
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
