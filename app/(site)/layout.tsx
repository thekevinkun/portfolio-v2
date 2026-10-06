import type { ReactNode } from "react";
import { StageBackground } from "@/components/ui";

// Public site only; the dashboard gets its own layout later
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StageBackground />
      {children}
    </>
  );
}
