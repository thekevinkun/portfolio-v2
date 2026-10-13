"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { ConfirmDialog, Input, Switch } from "@/components/dashboard/ui";
import { Button, Pill } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  deleteCategory,
  moveCategory,
  setCategoryVisible,
  updateCategory,
} from "@/lib/dashboard/actions/categories";
import { readText } from "@/lib/dashboard/form-data";
import type { ActionResult } from "@/types/action";
import type { AdminCategory } from "@/types/admin";

interface CategoryRowProps {
  category: AdminCategory;
  isFirst: boolean;
  isLast: boolean;
}

const CategoryRow = ({ category, isFirst, isLast }: CategoryRowProps) => {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const inUse = category.projectCount > 0;

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

  const rename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = readText(new FormData(event.currentTarget), "label");
    startTransition(async () => {
      const result = await updateCategory({ slug: category.slug, label });
      if (!result.ok) {
        setError(result.fieldErrors?.label?.[0] ?? result.error);
        return;
      }
      setError(undefined);
      toast.success("Category renamed");
    });
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const result = await deleteCategory({ id: category.id });
      if (result.ok) toast.success(`${category.label} deleted`);
      else toast.error(result.error);
    } finally {
      setDeleting(false);
    }
  };

  const usage =
    category.projectCount === 0
      ? "no projects"
      : `${category.projectCount} ${category.projectCount === 1 ? "project" : "projects"}${
          category.visibleProjectCount !== category.projectCount
            ? `, ${category.visibleProjectCount} visible`
            : ""
        }`;

  return (
    <li
      className={cn(
        "flex flex-wrap items-start gap-x-6 gap-y-3 py-4",
        !category.visible && "opacity-70",
      )}
    >
      <form onSubmit={rename} className="min-w-0 flex-1 basis-60 space-y-1.5">
        <div className="flex items-center gap-2">
          <Input
            name="label"
            defaultValue={category.label}
            aria-label={`Label of ${category.label}`}
            aria-invalid={error ? true : undefined}
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            disabled={pending}
            className="shrink-0 disabled:opacity-50"
          >
            Rename
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs text-fg-low">
            {category.slug} · {usage}
          </p>
          {!category.visible ? (
            <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
              Hidden
            </Pill>
          ) : null}
        </div>
        {error ? (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        ) : null}
      </form>

      <Switch
        label="Visible"
        checked={category.visible}
        disabled={pending}
        className="pt-2"
        onChange={() =>
          run(
            () =>
              setCategoryVisible({
                id: category.id,
                visible: !category.visible,
              }),
            category.visible
              ? `${category.label} tab hidden`
              : `${category.label} tab shown`,
          )
        }
      />

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Move ${category.label} up`}
          disabled={isFirst || pending}
          className="disabled:opacity-40"
          onClick={() =>
            run(() => moveCategory({ id: category.id, direction: "up" }))
          }
        >
          ↑
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Move ${category.label} down`}
          disabled={isLast || pending}
          className="disabled:opacity-40"
          onClick={() =>
            run(() => moveCategory({ id: category.id, direction: "down" }))
          }
        >
          ↓
        </Button>
        {inUse ? (
          <Button
            size="sm"
            variant="secondary"
            disabled
            title="Move or delete its projects first"
            className="opacity-40"
          >
            Delete
          </Button>
        ) : (
          <ConfirmDialog
            triggerLabel="Delete"
            title={`Delete ${category.label}?`}
            description="This permanently deletes the category. It has no projects."
            pending={deleting}
            onConfirm={remove}
          />
        )}
      </div>
    </li>
  );
};

export default CategoryRow;
