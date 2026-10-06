import { notFound } from "next/navigation";
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

export default async function Page({ params }: PageProps) {
  const { section } = await params;
  const path = "/" + (section?.join("/") ?? "");
  const current = SECTIONS.find((s) => s.path === path);
  if (!current) notFound();

  // Placeholder until the Stage exists (P2)
  return (
    <main className="flex h-full items-center justify-center">
      <h1 className="text-2xl font-bold">{current.label}</h1>
    </main>
  );
}
