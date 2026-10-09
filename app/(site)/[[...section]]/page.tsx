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
import { profile, skillGroups, projects, experienceItems } from "@/data/seed";
import { getSectionIndex } from "@/lib/stage/section-index";
import { getSectionTitle } from "@/lib/stage/section-title";
import { SECTIONS } from "@/lib/stage/sections";
import type { SectionId } from "@/types/stage";

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

  // Static data until P4.4
  const featured = projects
    .filter((project) => project.featured && project.visible)
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 3);

  const groups = skillGroups
    .filter((group) => group.visible)
    .sort((a, b) => a.sort - b.sort);

  const visibleProjects = projects
    .filter((project) => project.visible)
    .sort((a, b) => a.sort - b.sort);

  const experience = experienceItems
    .filter((item) => item.visible)
    .sort((a, b) => a.sort - b.sort);

  // All five pages are real now; PlaceholderPanel stays only as a fallback
  const pages: Partial<Record<SectionId, ReactNode>> = {
    overview: <OverviewPanel profile={profile} featured={featured} />,
    "tech-stack": <TechStackPanel groups={groups} />,
    projects: <ProjectsPanel projects={visibleProjects} />,
    experience: <ExperiencePanel items={experience} />,
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
