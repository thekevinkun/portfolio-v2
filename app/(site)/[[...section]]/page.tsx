import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPanel } from "@/components/panels";
import { Stage } from "@/components/stage";
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

  // Placeholder panels until P3; the layout's provider knows the initial page
  const panels = SECTIONS.map((s) => ({
    id: s.id,
    content: <PlaceholderPanel id={s.id} label={s.label} />,
  }));

  return <Stage panels={panels} />;
}
