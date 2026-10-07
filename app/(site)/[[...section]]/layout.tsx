import type { ReactNode } from "react";
import { Dock, StatusFooter, TabBar, TopBar } from "@/components/chrome";
import {
  StageInputs,
  StageLiveRegion,
  StageProvider,
  StageUrlSync,
} from "@/components/stage";
import { StageBackground } from "@/components/ui";
import { profile } from "@/data/seed";
import { getSectionIndex } from "@/lib/stage/section-index";

interface SiteLayoutProps {
  children: ReactNode;
  params: Promise<{ section?: string[] }>;
}

// Public site only. Chrome and Stage share one provider; the URL sets the
// initial page so the server renders the right panel with no flash.
export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const { section } = await params;
  const initialIndex = Math.max(0, getSectionIndex(section));

  return (
    <StageProvider initialIndex={initialIndex}>
      <StageInputs />
      <StageUrlSync />
      <StageLiveRegion />
      <StageBackground />
      <div className="flex h-dvh flex-col overflow-hidden">
        <TopBar profile={profile} />
        <Dock />
        <div className="relative min-h-0 flex-1">{children}</div>
        <StatusFooter profile={profile} />
        <TabBar />
      </div>
    </StageProvider>
  );
}
