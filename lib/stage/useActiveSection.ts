"use client";

import { usePathname } from "next/navigation";
import type { SectionId } from "@/types/stage";
import { SECTIONS } from "./sections";

// Today the URL decides the active page. In P2.7 this reads the Stage state instead.
export function useActiveSection(): SectionId {
  const pathname = usePathname();
  return (
    SECTIONS.find((section) => section.path === pathname)?.id ?? "overview"
  );
}
