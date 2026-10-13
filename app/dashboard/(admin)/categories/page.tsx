import type { Metadata } from "next";
import CategoryAddForm from "@/components/dashboard/CategoryAddForm";
import CategoryRow from "@/components/dashboard/CategoryRow";
import FormSection from "@/components/dashboard/FormSection";
import { ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminCategories } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8 lg:px-10 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg-high">
            Categories
          </h1>
          <p className="mt-1 max-w-xl text-sm text-fg-low">
            The tabs on the Projects page. A tab shows only while it is visible
            and has at least one visible project. Hiding a category removes its
            tab; its projects stay visible, so a featured one still shows on
            Overview.
          </p>
        </div>
        <ButtonLink href="/dashboard/projects" variant="secondary" size="sm">
          ← Projects
        </ButtonLink>
      </header>

      <FormSection title="Add a category">
        <CategoryAddForm />
      </FormSection>

      <FormSection
        title="All categories"
        description="Order here is the order of the tabs. The first tab opens by default."
      >
        <ul className="divide-y divide-glass-border">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
            />
          ))}
        </ul>
      </FormSection>
    </div>
  );
}
