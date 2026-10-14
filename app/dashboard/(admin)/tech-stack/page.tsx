import type { Metadata } from "next";
import FormSection from "@/components/dashboard/FormSection";
import SkillGroupRow from "@/components/dashboard/SkillGroupRow";
import { ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminSkillGroups } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Tech Stack" };

export default async function TechStackPage() {
  await requireAdmin();
  const groups = await getAdminSkillGroups();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8 lg:px-10 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg-high">
            Tech Stack
          </h1>
          <p className="mt-1 max-w-xl text-sm text-fg-low">
            The cards on the Tech Stack page. You can edit, reorder and hide
            them; the page is designed for four cards, so groups can&apos;t be
            added or deleted.
          </p>
        </div>
        <ButtonLink
          href="/tech-stack"
          variant="secondary"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View site ↗
        </ButtonLink>
      </header>

      <FormSection title="Groups">
        <ul className="divide-y divide-glass-border">
          {groups.map((group, index) => (
            <SkillGroupRow
              key={group.id}
              group={group}
              isFirst={index === 0}
              isLast={index === groups.length - 1}
            />
          ))}
        </ul>
      </FormSection>
    </div>
  );
}
