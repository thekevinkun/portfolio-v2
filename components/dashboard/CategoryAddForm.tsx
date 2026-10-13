"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { FieldRow, Input } from "./ui";
import { createCategory } from "@/lib/dashboard/actions/categories";
import { readText } from "@/lib/dashboard/form-data";
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { slugify } from "@/lib/dashboard/slugify";
import { MAX_CATEGORY_LABEL } from "@/types/limits";

const CategoryAddForm = () => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const label = readText(new FormData(form), "label");
    // The slug comes from the label and can't be changed later
    const slug = slugify(label);
    if (!slug) {
      setError("Use letters or digits in the label.");
      return;
    }

    startTransition(async () => {
      const result = await createCategory({ slug, label });
      if (!result.ok) {
        const errors = toFormErrors(result.fieldErrors);
        setError(errors.label ?? errors.slug ?? result.error);
        return;
      }
      setError(undefined);
      form.reset();
      toast.success(`${label} added`);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-wrap items-start gap-3"
    >
      <FieldRow
        label="Label"
        htmlFor="category-label"
        hint={`Up to ${MAX_CATEGORY_LABEL} characters. The address part is made from it and can't be changed later.`}
        error={error}
        className="min-w-0 flex-1 basis-64"
      >
        <Input
          id="category-label"
          name="label"
          placeholder="Python"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? "category-label-hint category-label-error"
              : "category-label-hint"
          }
        />
      </FieldRow>
      <Button
        type="submit"
        disabled={pending}
        className="mt-6 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add category"}
      </Button>
    </form>
  );
};

export default CategoryAddForm;
