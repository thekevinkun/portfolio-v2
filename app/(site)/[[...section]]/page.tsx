import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OverviewPanel, PlaceholderPanel } from "@/components/panels";
import { Stage } from "@/components/stage";
import { profile, projects } from "@/data/seed";
import { getSectionIndex } from "@/lib/stage/section-index";
import { getSectionTitle } from "@/lib/stage/section-title";
import { SECTIONS } from "@/lib/stage/sections";

interface PageProps {
  params: Promise<{ section?: string[] }>;
}

// Only the five known URLs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.map((s) => ({
    section: s.path === "/" ? [] : [s.id],
  }));
}

// Each URL gets its own title in the server-rendered HTML
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section } = await params;
  const current = SECTIONS[getSectionIndex(section)];
  return current ? { title: getSectionTitle(current) } : {};
}

export default async function Page({ params }: PageProps) {
  const { section } = await params;
  if (getSectionIndex(section) === -1) notFound();

  // Static data until P4.4; Overview shows the first three featured projects
  const featured = projects
    .filter((project) => project.featured && project.visible)
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 3);

  // The other four pages stay placeholders until P3.4–P3.7
  const panels = SECTIONS.map((s) => ({
    id: s.id,
    content:
      s.id === "overview" ? (
        <OverviewPanel profile={profile} featured={featured} />
      ) : (
        <PlaceholderPanel id={s.id} label={s.label} />
      ),
  }));

  return <Stage panels={panels} />;
}
