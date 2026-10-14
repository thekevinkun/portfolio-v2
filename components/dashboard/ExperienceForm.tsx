"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui";
import FormSection from "./FormSection";
import TextField from "./TextField";
import { FieldRow, Input, Textarea } from "./ui";
import { updateExperienceItem } from "@/lib/dashboard/actions/experience";
import {
  joinLines,
  readLines,
  readText,
  splitLines,
} from "@/lib/dashboard/form-data";
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { moved } from "@/lib/dashboard/list";
import type { AdminExperienceItem } from "@/types/admin";
import {
  MAX_EXPERIENCE_BULLETS,
  MAX_EXPERIENCE_TAGS,
  MAX_SHIPPED_BULLETS,
  MAX_SHIPPED_PROJECTS,
  MIN_SHIPPED_BULLETS,
  SHIPPED_COMPACT_BULLETS,
} from "@/types/limits";

interface ProjectRow {
  key: number;
  name: string;
  // One bullet per line
  bullets: string;
}

// aria-describedby for a control that always has a hint and maybe an error
const describedBy = (id: string, hasError: boolean) =>
  hasError ? `${id}-hint ${id}-error` : `${id}-hint`;

// Edits one item. Work shows the short summary and the Shipped list, Learning
// shows its bullets (D56); the server applies the same split by kind.
const ExperienceForm = ({ item }: { item: AdminExperienceItem }) => {
  const isWork = item.kind !== "education";
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Row keys are counters, so the server and the browser render the same ids
  const nextKey = useRef(item.shipped?.length ?? 0);
  const [projects, setProjects] = useState<ProjectRow[]>(() =>
    (item.shipped ?? []).map((project, key) => ({
      key,
      name: project.name,
      bullets: joinLines(project.bullets),
    })),
  );

  const addProject = () => {
    const key = nextKey.current++;
    setProjects((previous) =>
      previous.length >= MAX_SHIPPED_PROJECTS
        ? previous
        : [...previous, { key, name: "", bullets: "" }],
    );
  };

  const changeProject = (
    key: number,
    patch: Partial<Omit<ProjectRow, "key">>,
  ) =>
    setProjects((previous) =>
      previous.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => readText(data, name);

    // A completely empty project row is dropped; a half-filled one is an error
    const kept = projects.filter(
      (row) => row.name.trim() !== "" || row.bullets.trim() !== "",
    );

    const endDate = text("endDate");
    const content = {
      slug: item.slug,
      title: text("title"),
      organization: text("organization"),
      startDate: text("startDate"),
      // Empty means Present
      endDate: endDate === "" ? null : endDate,
      summary: text("summary"),
      summaryShort: text("summaryShort") || undefined,
      bullets: readLines(data, "bullets"),
      tags: readLines(data, "tags"),
      shipped: isWork
        ? kept.map((row) => ({
            name: row.name.trim(),
            bullets: splitLines(row.bullets),
          }))
        : undefined,
    };

    // Server paths ("shipped.1.name", "tags.2") to the control that shows them
    const rename = (key: string): string => {
      const project = /^shipped\.(\d+)\.(name|bullets)(?:\.\d+)?$/.exec(key);
      if (project) {
        const row = kept[Number(project[1])];
        return row ? `shipped.${row.key}.${project[2]}` : "shipped";
      }
      const list = /^(bullets|tags)\.\d+$/.exec(key);
      return list?.[1] ?? key;
    };

    startTransition(async () => {
      try {
        const result = await updateExperienceItem(content);
        if (!result.ok) {
          setErrors(toFormErrors(result.fieldErrors, rename));
          toast.error(result.error);
          return;
        }
        setErrors({});
        setProjects(kept);
        toast.success("Saved");
      } catch (error) {
        console.error("Could not save the item:", error);
        toast.error("Could not save. Check your connection and try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection title="Basics">
        <TextField
          name="title"
          label="Title"
          defaultValue={item.title}
          error={errors.title}
        />
        <TextField
          name="organization"
          label="Organization"
          defaultValue={item.organization}
          error={errors.organization}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="startDate"
            label="Start"
            defaultValue={item.startDate}
            hint="Year and month, for example 2019-01."
            error={errors.startDate}
          />
          <TextField
            name="endDate"
            label="End"
            defaultValue={item.endDate ?? ""}
            hint="Leave empty for Present."
            error={errors.endDate}
          />
        </div>
      </FormSection>

      <FormSection title="Summary">
        <TextField
          name="summary"
          label="Summary"
          rows={5}
          defaultValue={item.summary}
          hint={
            isWork
              ? "Shown in the carousel and on phones."
              : "Shown on the Learning card."
          }
          error={errors.summary}
        />
        {isWork ? (
          <TextField
            name="summaryShort"
            label="Short summary"
            rows={3}
            defaultValue={item.summaryShort ?? ""}
            hint="Shown in the wide layout (from 1280 px). Leave empty to show the full summary there too."
            error={errors.summaryShort}
          />
        ) : null}
      </FormSection>

      {isWork ? (
        <FormSection
          title="Shipped projects"
          description={`Up to ${MAX_SHIPPED_PROJECTS}: the wide layout is a row of the Work card and three Shipped cards. The name is free text; it doesn't have to match a project in the Projects list.`}
        >
          <ul className="space-y-4">
            {projects.map((row, index) => {
              const id = `shipped-${row.key}`;
              const nameError = errors[`shipped.${row.key}.name`];
              const bulletsError = errors[`shipped.${row.key}.bullets`];
              const count = splitLines(row.bullets).length;
              return (
                <li
                  key={row.key}
                  className="space-y-3 rounded-lg border border-glass-border p-4"
                >
                  <FieldRow
                    label={`Project ${index + 1} name`}
                    htmlFor={`${id}-name`}
                    error={nameError}
                  >
                    <Input
                      id={`${id}-name`}
                      value={row.name}
                      aria-invalid={nameError ? true : undefined}
                      aria-describedby={
                        nameError ? `${id}-name-error` : undefined
                      }
                      onChange={(event) =>
                        changeProject(row.key, { name: event.target.value })
                      }
                    />
                  </FieldRow>
                  <FieldRow
                    label="What you did"
                    htmlFor={`${id}-bullets`}
                    hint={`${count} ${count === 1 ? "bullet" : "bullets"}. Use ${MIN_SHIPPED_BULLETS}–${MAX_SHIPPED_BULLETS}, one per line. The first ${SHIPPED_COMPACT_BULLETS} show in the wide layout; the rest only in the carousel.`}
                    error={bulletsError}
                  >
                    <Textarea
                      id={`${id}-bullets`}
                      rows={6}
                      value={row.bullets}
                      aria-invalid={bulletsError ? true : undefined}
                      aria-describedby={describedBy(
                        `${id}-bullets`,
                        Boolean(bulletsError),
                      )}
                      onChange={(event) =>
                        changeProject(row.key, { bullets: event.target.value })
                      }
                    />
                  </FieldRow>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move project ${index + 1} up`}
                      disabled={index === 0}
                      className="disabled:opacity-40"
                      onClick={() =>
                        setProjects((previous) => moved(previous, index, -1))
                      }
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Move project ${index + 1} down`}
                      disabled={index === projects.length - 1}
                      className="disabled:opacity-40"
                      onClick={() =>
                        setProjects((previous) => moved(previous, index, 1))
                      }
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Remove project ${index + 1}`}
                      onClick={() =>
                        setProjects((previous) =>
                          previous.filter((project) => project.key !== row.key),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          {errors.shipped ? (
            <p role="alert" className="text-xs text-danger">
              {errors.shipped}
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              disabled={projects.length >= MAX_SHIPPED_PROJECTS}
              className="disabled:opacity-40"
              onClick={addProject}
            >
              Add project
            </Button>
            <span className="font-mono text-xs text-fg-low">
              {projects.length} / {MAX_SHIPPED_PROJECTS}
            </span>
          </div>
        </FormSection>
      ) : (
        <FormSection title="Courses">
          <TextField
            name="bullets"
            label="Bullets"
            rows={6}
            defaultValue={joinLines(item.bullets)}
            hint={`One per line, up to ${MAX_EXPERIENCE_BULLETS}. For example a course name, a dash and a short description.`}
            error={errors.bullets}
          />
        </FormSection>
      )}

      <FormSection title="Tags">
        <TextField
          name="tags"
          label="Tags"
          rows={6}
          defaultValue={joinLines(item.tags)}
          hint={`One per line, up to ${MAX_EXPERIENCE_TAGS}.`}
          error={errors.tags}
        />
      </FormSection>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-glass-border bg-obsidian px-6 py-3 lg:-mx-10 lg:px-10">
        <ButtonLink href="/dashboard/experience" variant="secondary">
          Back to list
        </ButtonLink>
        <Button
          type="submit"
          disabled={pending}
          className="disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
