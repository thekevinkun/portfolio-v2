import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, GlassCard } from "@/components/ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminCounts } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Dashboard" };

const plural = (count: number, word: string) =>
  `${count} ${count === 1 ? word : `${word}s`}`;

const join = (parts: (string | false)[]) =>
  parts.filter((part): part is string => part !== false).join(" · ");

interface OverviewCard {
  href: string;
  title: string;
  summary: string;
  note?: string;
}

export default async function DashboardOverview() {
  const session = await requireAdmin();
  const counts = await getAdminCounts();
  const { skillGroups, projects, experience } = counts;

  const cards: OverviewCard[] = [
    {
      href: "/dashboard/profile",
      title: "Profile",
      summary: "Identity, contact, availability, SEO and files",
    },
    {
      href: "/dashboard/tech-stack",
      title: "Tech Stack",
      summary: join([
        plural(skillGroups.total, "group"),
        skillGroups.hidden > 0 && `${skillGroups.hidden} hidden`,
      ]),
    },
    {
      href: "/dashboard/projects",
      title: "Projects",
      summary: join([
        plural(projects.total, "project"),
        projects.hidden > 0 && `${projects.hidden} hidden`,
        `${projects.featuredVisible} featured`,
      ]),
      // Overview shows the first three featured projects (D48)
      note:
        projects.featuredVisible === 3
          ? undefined
          : `Overview shows the first 3 featured projects; you have ${projects.featuredVisible}.`,
    },
    {
      href: "/dashboard/experience",
      title: "Experience",
      summary: join([
        plural(experience.total, "item"),
        experience.hidden > 0 && `${experience.hidden} hidden`,
      ]),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-8 lg:px-10 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg-high">
            Overview
          </h1>
          <p className="mt-1 text-sm text-fg-low">
            Signed in as {session.user.name ?? "admin"}. Manage the content
            shown on the public site.
          </p>
        </div>
        <ButtonLink
          href="/"
          variant="secondary"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View site ↗
        </ButtonLink>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <GlassCard
                interactive
                spotlight={false}
                className="h-full space-y-1.5 p-5"
              >
                <h2 className="text-base font-bold tracking-tight text-fg-high">
                  {card.title}
                </h2>
                <p className="text-sm text-fg-medium">{card.summary}</p>
                {card.note ? (
                  <p className="text-xs text-fg-low">{card.note}</p>
                ) : null}
              </GlassCard>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
