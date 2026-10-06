import type { ReactNode } from "react";
import { StatusFooter, TopBar } from "@/components/chrome";
import { StageBackground } from "@/components/ui";
import { profile } from "@/data/seed";

// Public site only. The chrome stays mounted; only the middle area will slide (P2).
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StageBackground />
      
      <div className="flex h-dvh flex-col overflow-hidden">
        <TopBar profile={profile} />
        <div className="relative min-h-0 flex-1">{children}</div>
        <StatusFooter profile={profile} />
      </div>
    </>
  );
}
