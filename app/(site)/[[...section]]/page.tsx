import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  OverviewPanel,
  PlaceholderPanel,
  ProjectsPanel,
  TechStackPanel,
  ExperiencePanel,
  ContactPanel,
} from "@/components/panels";
import { Stage } from "@/components/stage";
import { Spotlight } from "@/components/ui";
import { getProfile, getStageData } from "@/lib/db/queries";
import { getSectionMetadata } from "@/lib/seo/metadata";
import { getSectionIndex } from "@/lib/stage/section-index";
import { SECTIONS } from "@/lib/stage/sections";
import type { SectionId } from "@/types/stage";

interface PageProps {
  params: Promise<{ section?: string[] }>;
}

// Only the five known URLs exist; anything else is a 404.
export const dynamicParams = false;

// Pages are built from Neon and refreshed at most once an hour. The dashboard
// will revalidate on save in P5 (D69). Next needs a literal value here.
export const revalidate = 3600;

export function generateStaticParams() {
  return SECTIONS.map((s) => ({
    section: s.path === "/" ? [] : [s.id],
  }));
}

// Each URL gets its own title, description, canonical and share tags (D30)
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section } = await params;
  const current = SECTIONS[getSectionIndex(section)];
  if (!current) return {};
  return getSectionMetadata(current, await getProfile());
}

export default async function Page({ params }: PageProps) {
  const { section } = await params;
  if (getSectionIndex(section) === -1) notFound();

  // Visible rows, already sorted by the queries
  const { profile, skillGroups, projects, experienceItems } =
    await getStageData();

  // Overview shows the first three featured projects (D48)
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  // All five pages are real now; PlaceholderPanel stays only as a fallback
  const pages: Partial<Record<SectionId, ReactNode>> = {
    overview: <OverviewPanel profile={profile} featured={featured} />,
    "tech-stack": <TechStackPanel groups={skillGroups} />,
    projects: <ProjectsPanel projects={projects} />,
    experience: <ExperiencePanel items={experienceItems} />,
    contact: <ContactPanel profile={profile} />,
  };

  const panels = SECTIONS.map((s) => ({
    id: s.id,
    content: pages[s.id] ?? <PlaceholderPanel id={s.id} label={s.label} />,
  }));

  return (
    <>
      <Stage panels={panels} />
      <Spotlight />
    </>
  );
}
