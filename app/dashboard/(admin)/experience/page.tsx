import type { Metadata } from "next";
import FormSection from "@/components/dashboard/FormSection";
import { ButtonLink, Pill } from "@/components/ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminExperienceItems } from "@/lib/db/admin-queries";
import { formatRange } from "@/lib/experience/format";
import type { ExperienceKind } from "@/types/experience";

export const metadata: Metadata = { title: "Experience" };

const KIND_LABELS: Record<ExperienceKind, string> = {
  work: "Work",
  freelance: "Work",
  education: "Learning",
  milestone: "Milestone",
};

export default async function ExperiencePage() {
  await requireAdmin();
  const items = await getAdminExperienceItems();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8 lg:px-10 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg-high">
            Experience
          </h1>
          <p className="mt-1 max-w-xl text-sm text-fg-low">
            The Experience page is designed for one Work card with its Shipped
            projects and one Learning card, so these items can&apos;t be added,
            deleted, reordered or hidden. Edit their content here.
          </p>
        </div>
        <ButtonLink
          href="/experience"
          variant="secondary"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View site ↗
        </ButtonLink>
      </header>

      <FormSection title="Items">
        <ul className="divide-y divide-glass-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4"
            >
              <div className="min-w-0 flex-1 basis-56">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-fg-high">
                    {item.title}
                  </h3>
                  <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
                    {KIND_LABELS[item.kind]}
                  </Pill>
                  {!item.visible ? (
                    <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
                      Hidden
                    </Pill>
                  ) : null}
                </div>
                <p className="mt-1 truncate font-mono text-xs text-fg-low">
                  {item.organization} ·{" "}
                  {formatRange(item.startDate, item.endDate)} ·{" "}
                  {item.kind === "education"
                    ? `${item.bullets.length} bullets`
                    : `${item.shipped?.length ?? 0} shipped projects`}{" "}
                  · {item.tags.length} tags
                </p>
              </div>
              <ButtonLink
                href={`/dashboard/experience/${item.slug}`}
                variant="secondary"
                size="sm"
                aria-label={`Edit ${item.title}`}
              >
                Edit
              </ButtonLink>
            </li>
          ))}
        </ul>
      </FormSection>
    </div>
  );
}
